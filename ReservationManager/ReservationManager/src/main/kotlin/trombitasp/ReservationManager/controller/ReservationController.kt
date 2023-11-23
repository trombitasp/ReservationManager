package trombitasp.ReservationManager.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
//import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.repository.ReservationRepository

@RestController
@RequestMapping("/api")
@CrossOrigin
class ReservationController(private val reservationRepository: ReservationRepository) {
    @GetMapping("/reservations")
    fun findAllReservation() = reservationRepository.findAll()

    @GetMapping("/reservations/{id}/{uid}")
    fun findReservationById(@PathVariable id: Int, @PathVariable uid: String): ResponseEntity<Reservation> {
        return reservationRepository.findById(id).map { r ->
            ResponseEntity.ok(r)
        }.orElse(ResponseEntity.notFound().build())
    }

    /*@GetMapping("/reservations/byuser/{uid}")
    fun findAllUserByName(@PathVariable uid: String) = reservationRepository.findAllByUserId(uid)*/
    @GetMapping("/reservations/{id}/{uid}")
    fun findAllUserByName2(@PathVariable id: String, @PathVariable uid: String) = reservationRepository.findAll(uid, id)

    @PostMapping("/reservations")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LOGGED_IN')")
    fun saveReservation(@RequestBody reservation: Reservation) = reservationRepository.save(reservation)

    @PutMapping("/reservations/{id}")
    fun updateReservation(@PathVariable id: Int, @RequestBody reservation: Reservation): ResponseEntity<Reservation> {
        return reservationRepository.findById(id).map { existingReservation ->
            val updatedReservation: Reservation = existingReservation.copy(
                user = reservation.user,
                resource = reservation.resource,
                beginningOfReservation = reservation.beginningOfReservation,
                endOfReservation = reservation.endOfReservation,
                description = reservation.description
            )
            ResponseEntity.ok().body(reservationRepository.save(updatedReservation))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/reservations/{id}")
    fun deleteReservationById(@PathVariable id: Int): ResponseEntity<Void> {
        return reservationRepository.findById(id).map { r  ->
            reservationRepository.delete(r)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }
}