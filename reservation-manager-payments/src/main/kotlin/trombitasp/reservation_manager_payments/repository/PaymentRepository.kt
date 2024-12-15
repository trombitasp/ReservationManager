package trombitasp.reservation_manager_payments.repository

import org.springframework.data.jpa.repository.JpaRepository
import trombitasp.reservation_manager_payments.model.Payment
import org.springframework.stereotype.Repository

@Repository
public interface PaymentRepository: JpaRepository<Payment, Int> {
}