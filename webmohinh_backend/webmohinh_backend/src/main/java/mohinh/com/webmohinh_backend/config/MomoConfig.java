package mohinh.com.webmohinh_backend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class MomoConfig {
    // IMPORTANT: Verify these credentials are correct for your MoMo test account.
    public static final String PARTNER_CODE = "MOMOXXXX2020";
    public static final String ACCESS_KEY = "F8BBA842ECF85";
    public static final String SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    public static final String ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
}
