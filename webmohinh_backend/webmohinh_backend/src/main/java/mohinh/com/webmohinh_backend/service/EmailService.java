package mohinh.com.webmohinh_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServecer {
    @Autowired
    private JavaMailSender mailSender;

    // Email mặc định sẽ được gửi từ địa chỉ cấu hình trong application.properties
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            System.out.println("Email Sent Successfully to: " + to);
        } catch (MailException e) {
            e.printStackTrace();
            // Xử lý lỗi (ví dụ: log lỗi, throw exception)
            throw new RuntimeException("Error sending email: " + e.getMessage());
        }
    }
}
