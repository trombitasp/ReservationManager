package trombitasp.ReservationManager.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
//import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import trombitasp.ReservationManager.email.EmailSenderService
import trombitasp.ReservationManager.model.Reservation
import trombitasp.ReservationManager.repository.ReservationRepository

@RestController
@RequestMapping("/api")
@CrossOrigin
class ReservationController(private val reservationRepository: ReservationRepository,
                            @Autowired private val emailSenderService: EmailSenderService
) {
    @GetMapping("/reservations")
    fun findAllReservation() = reservationRepository.findAll()

    @GetMapping("/reservations/{id}/{uid}/")
    fun findAllUserByName2(@PathVariable id: String, @PathVariable uid: String) = reservationRepository.findAll(uid, id)

    @PostMapping("/reservations")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LOGGED_IN')")
    fun saveReservation(@RequestBody reservation: Reservation) = run {
        sendEmails(reservation, EmailType.Save)
        reservationRepository.save(reservation)
    }

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
            sendEmails(updatedReservation, EmailType.Update)
            ResponseEntity.ok().body(reservationRepository.save(updatedReservation))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("/reservations/{id}")
    fun deleteReservationById(@PathVariable id: Int): ResponseEntity<Void> {
        return reservationRepository.findById(id).map { r  ->
            reservationRepository.delete(r)
            sendEmails(r, EmailType.Update)
            ResponseEntity<Void>(HttpStatus.OK)
        }.orElse(ResponseEntity.notFound().build())
    }


    fun sendEmails(reservation: Reservation, type: EmailType): Reservation {
        val res = reservationRepository.save(reservation)
        when (type) {
            EmailType.Save -> {
                emailSenderService.sendSimpleEmail(reservation.user.email!!,
                    "Kedves ${reservation.user.username}!\n\n" +
                            "A Reservation Manager rendszer fogadta a foglalásodat, és elmentette az adatbázisába.\n" +
                            "A foglalásod időpontja: ${reservation.beginningOfReservation} - ${reservation.endOfReservation}, " +
                            "ennél a szolgáltatónál: ${reservation.resource.resourceProvider.name}" +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: foglalásod rögzítve")

                emailSenderService.sendSimpleEmail(reservation.resource.resourceProvider.email!!,
                    "Kedves ${reservation.resource.resourceProvider.name}!\n\n" +
                            "A Reservation Manager rendszer fogadott egy foglalást hozzád, és elmentette az adatbázisába.\n" +
                            "A foglalás részletei:\n" +
                            "Időpont: ${reservation.beginningOfReservation} - ${reservation.endOfReservation}\n" +
                            "Foglaló: ${reservation.user.username} (${reservation.user.email})" +
                            if (!reservation.description.isNullOrEmpty()) {
                                "Leírás: ${reservation.description}"
                            } else {""}
                            +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: beérkezett foglalás")
            }
            EmailType.Update -> {
                emailSenderService.sendSimpleEmail(reservation.user.email!!,
                    "Kedves ${reservation.user.username}!\n\n" +
                            "A Reservation Manager rendszer fogadta a foglalásod módosítását, és elmentette az adatbázisába.\n" +
                            "A foglalásod új időpontja: ${reservation.beginningOfReservation} - ${reservation.endOfReservation}, " +
                            "ennél a szolgáltatónál: ${reservation.resource.resourceProvider.name}" +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: foglalásod módosítva")

                emailSenderService.sendSimpleEmail(reservation.resource.resourceProvider.email!!,
                    "Kedves ${reservation.resource.resourceProvider.name}!\n\n" +
                            "A Reservation Manager rendszerben változtattak egy foglaláson.\n" +
                            "A foglalás részletei:\n" +
                            "Új időpont: ${reservation.beginningOfReservation} - ${reservation.endOfReservation}\n" +
                            "Foglaló: ${reservation.user.username} (${reservation.user.email})" +
                            if (!reservation.description.isNullOrEmpty()) {
                                "Leírás: ${reservation.description}"
                            } else {""}
                            +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: módosított foglalás")
            }
            EmailType.Delete -> {
                emailSenderService.sendSimpleEmail(reservation.user.email!!,
                    "Kedves ${reservation.user.username}!\n\n" +
                            "A Reservation Manager rendszer fogadta a foglalásod törlését, és törölte az adatbázisából.\n" +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: foglalásod törölve")

                emailSenderService.sendSimpleEmail(reservation.resource.resourceProvider.email!!,
                    "Kedves ${reservation.resource.resourceProvider.name}!\n\n" +
                            "A Reservation Manager rendszerben töröltek egy foglalást.\n" +
                            "A foglalás részletei:\n" +
                            "Időpont: ${reservation.beginningOfReservation} - ${reservation.endOfReservation}\n" +
                            "\n\n" +
                            "Üdvözlettel:\nReservation Manager rendszer",
                    "Reservation Manager: törölt foglalás")
            }
        }
        return res
    }
}

enum class EmailType {
    Save,
    Update,
    Delete
}