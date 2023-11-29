package trombitasp.ReservationManager.email

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component


@Component
public class EmailServiceImpl() {

    @Autowired
    private val emailSender: JavaMailSender? = null

    public fun sendSimpleMessage(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.setFrom("trombitasp@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender!!.send(message);
    }
}