package trombitasp.ReservationManager.controller

import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Az authentikáció tesztelésére létrehozott controller, éles működés során nincs használva.
 * Az egyes endpointok csak a megfelelő jogosultságok (role-ok) birtokában elérhetők.
 */
@CrossOrigin(origins = ["*"], maxAge = 3600)
@RestController
@RequestMapping("/api/test")
class TestController {
    @GetMapping("/all")
    fun allAccess(): String {
        return "publikus dolgok"
    }

    @GetMapping("/default")
    @PreAuthorize("hasAuthority('DEFAULT') or hasAuthority('LOGGED_IN') or hasAuthority('ADMIN')")
    fun defaultAccess(): String {
        return "Default jog dolgok"
    }

    @GetMapping("/logged_in")
    @PreAuthorize("hasAuthority('LOGGED_IN')")
    fun logged_inAccess(): String {
        return "LOGGED_IN dolgok."
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun adminAccess(): String {
        return "Admin dolgok."
    }
}