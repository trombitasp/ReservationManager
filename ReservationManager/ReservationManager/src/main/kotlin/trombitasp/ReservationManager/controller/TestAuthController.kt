package trombitasp.ReservationManager.controller

import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin(origins = ["*"], maxAge = 3600)
@RestController
@RequestMapping("/api/test")
class TestController {
    @GetMapping("/all")
    fun allAccess(): String {
        return "Public Content."
    }

    @GetMapping("/default")
    @PreAuthorize("hasAuthority('DEFAULT') or hasAuthority('LOGGED_IN') or hasAuthority('ADMIN')")
    fun userAccess(): String {
        return "Default user Content."
    }

    @GetMapping("/logged_in")
    @PreAuthorize("hasAuthority('LOGGED_IN')")
    fun moderatorAccess(): String {
        return "LOGGED_IN content."
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun adminAccess(): String {
        return "Admin content."
    }
}