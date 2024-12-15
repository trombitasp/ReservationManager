package trombitasp.reservation_manager_payments.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import trombitasp.reservation_manager_payments.repository.PaymentRepository

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
class PaymentController(
    private val paymentRepository: PaymentRepository
) {
    @GetMapping("/")
    fun findAllPayment() = paymentRepository.find()

    @GetMapping("/{id}")
    fun findPaymentById(@PathVariable id: Int): ResponseEntity<Payment> {
        return paymentRepository.findById(id).map { r ->
            ResponseEntity.ok(r)
        }.orElse(ResponseEntity.notFound().build())
    }

    @PostMapping("/")
    fun savePayment(@RequestBody payment: Payment) = paymentRepository.save(payment)

    @PutMapping("/{id}")
    fun updatePayment(@PathVariable id: Int, @RequestBody payment: Payment): ResponseEntity<Payment> {
        return paymentRepository.findById(id).map { existingPayment ->
            val updatedPayment: Payment = existingPayment.copy(
                havePayed = existingPayment.havePayed)
            ResponseEntity.ok().body(paymentRepository.save(updatedPayment))
        }.orElse(ResponseEntity.notFound().build())
    }
}