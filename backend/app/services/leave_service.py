import datetime
from sqlalchemy.orm import Session
from app.database.models import (
    LeaveType, LeaveRule, LeavePeriod, LeaveEntitlement, 
    LeaveTransaction, LeaveTransactionHistory, LeaveBalanceSnapshot,
    LeaveBalanceAdjustment
)

class LeaveTypeService:
    @staticmethod
    def get_all(db: Session):
        return db.query(LeaveType).filter(LeaveType.is_active == True).all()

class LeaveRuleService:
    @staticmethod
    def resolve_rule(db: Session, leave_type_id: int, effective_date: datetime.date):
        """
        Resolves the rule that was active on the effective_date.
        """
        rule = db.query(LeaveRule).filter(
            LeaveRule.leave_type_id == leave_type_id,
            LeaveRule.effective_date <= effective_date,
            LeaveRule.is_active == True
        ).order_by(LeaveRule.effective_date.desc()).first()
        
        return rule

class LeavePeriodService:
    @staticmethod
    def ensure_period_exists(db: Session, employee_id: int, leave_type_id: int, period_start: datetime.date, period_end: datetime.date, rule_id: int):
        """
        Idempotent generator for leave periods.
        """
        existing = db.query(LeavePeriod).filter(
            LeavePeriod.employee_id == employee_id,
            LeavePeriod.leave_type_id == leave_type_id,
            LeavePeriod.period_start == period_start,
            LeavePeriod.period_end == period_end
        ).first()
        
        if existing:
            return existing
            
        new_period = LeavePeriod(
            employee_id=employee_id,
            leave_type_id=leave_type_id,
            period_start=period_start,
            period_end=period_end,
            rule_id=rule_id
        )
        db.add(new_period)
        db.commit()
        db.refresh(new_period)
        return new_period

class LeaveCalculationService:
    @staticmethod
    def calculate_used_leave(db: Session, employee_id: int, leave_type_id: int, leave_period_id: int, rule: LeaveRule):
        """
        Calculates used leave based on the statuses configured in the rule that count against balance.
        """
        statuses = rule.counts_against_balance_status.split(',')
        transactions = db.query(LeaveTransaction).filter(
            LeaveTransaction.employee_id == employee_id,
            LeaveTransaction.leave_type_id == leave_type_id,
            LeaveTransaction.leave_period_id == leave_period_id,
            LeaveTransaction.status.in_(statuses)
        ).all()
        
        return sum(t.total_days for t in transactions)

    @staticmethod
    def calculate_balance(db: Session, employee_id: int, leave_type_id: int, leave_period_id: int):
        period = db.query(LeavePeriod).filter(LeavePeriod.id == leave_period_id).first()
        if not period:
            return None
            
        rule = db.query(LeaveRule).filter(LeaveRule.id == period.rule_id).first()
        entitlement = db.query(LeaveEntitlement).filter(LeaveEntitlement.leave_period_id == leave_period_id).first()
        
        if not entitlement:
            # We don't have entitlement data yet
            return {"status": "NOT_CALCULATED"}
            
        used = LeaveCalculationService.calculate_used_leave(db, employee_id, leave_type_id, leave_period_id, rule)
        
        adjustments = db.query(LeaveBalanceAdjustment).filter(
            LeaveBalanceAdjustment.leave_period_id == leave_period_id
        ).all()
        
        adj_total = sum(a.days if a.adjustment_type == 'INCREASE' else -a.days for a in adjustments)
        
        total_available = entitlement.entitlement + entitlement.carry_forward
        remaining = total_available - used + adj_total
        
        return {
            "entitlement": entitlement.entitlement,
            "carry_forward": entitlement.carry_forward,
            "total_available": total_available,
            "used": used,
            "adjustment": adj_total,
            "remaining": remaining,
            "status": "CALCULATED"
        }

class LeaveApprovalService:
    @staticmethod
    def transition_status(db: Session, transaction_id: int, new_status: str, changed_by: str, reason: str = None):
        transaction = db.query(LeaveTransaction).filter(LeaveTransaction.id == transaction_id).first()
        if not transaction:
            raise ValueError("Transaksi tidak ditemukan.")
            
        old_status = transaction.status
        transaction.status = new_status
        transaction.updated_by = changed_by
        
        history = LeaveTransactionHistory(
            leave_transaction_id=transaction.id,
            old_status=old_status,
            new_status=new_status,
            reason=reason,
            changed_by=changed_by
        )
        db.add(history)
        db.commit()
        return transaction
