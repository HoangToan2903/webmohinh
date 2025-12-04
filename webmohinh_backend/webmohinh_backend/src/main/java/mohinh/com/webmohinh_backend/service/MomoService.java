package mohinh.com.webmohinh_backend.service;

import mohinh.com.webmohinh_backend.config.MomoConfig;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.stream.Collectors;

@Service
public class MomoService {

    public String createPayment(String orderId, long amount) throws Exception {
        String requestId = String.valueOf(System.currentTimeMillis());
        String orderInfo = "Thanh toan don hang " + orderId;
        // NOTE: Ensure these URLs are accessible and correctly configured in your MoMo test environment.
        String redirectUrl = "https://yourdomain.com/payment-success";
        String ipnUrl = "https://yourdomain.com/api/momo/callback";
        String requestType = "captureWallet";

        // 1. Constructing the raw signature string (in alphabetical order as required by MoMo V2)
        String rawSignature = "accessKey=" + MomoConfig.ACCESS_KEY +
                "&amount=" + String.valueOf(amount) + // Explicitly cast to String
                "&extraData=" + "" +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + MomoConfig.PARTNER_CODE +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        // 2. Generate HMAC SHA256 signature
        String signature = HmacSHA256(rawSignature, MomoConfig.SECRET_KEY);

        // 3. Construct JSON payload
        JSONObject json = new JSONObject();
        json.put("partnerCode", MomoConfig.PARTNER_CODE);
        json.put("partnerName", "Test"); // Not part of the signature string
        json.put("storeId", "MomoTestStore"); // Not part of the signature string
        json.put("requestId", requestId);
        json.put("amount", amount);
        json.put("orderId", orderId);
        json.put("orderInfo", orderInfo);
        json.put("redirectUrl", redirectUrl);
        json.put("ipnUrl", ipnUrl);
        json.put("lang", "vi");
        json.put("extraData", "");
        json.put("requestType", requestType);
        json.put("signature", signature);

        // 4. Send request
        return sendHttpPost(MomoConfig.ENDPOINT, json.toString());
    }

    private String HmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] digest = mac.doFinal(data.getBytes());
        return DatatypeConverter.printHexBinary(digest).toLowerCase();
    }

    /**
     * Sends an HTTP POST request and handles error streams to capture detailed MoMo error messages.
     * The original issue was likely due to the generic IOException obscuring MoMo's specific 400 error message.
     */
    private String sendHttpPost(String url, String json) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Send the JSON payload
        try (OutputStream os = conn.getOutputStream()) {
            os.write(json.getBytes());
        }

        int responseCode = conn.getResponseCode();
        BufferedReader br;

        // CRITICAL FIX: If response code is 4xx or 5xx, read from the Error Stream
        if (responseCode >= 400) {
            br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        } else {
            // Otherwise, read from the normal Input Stream
            br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        }

        // Collect the response body
        String responseBody = br.lines().collect(Collectors.joining());
        br.close();

        // If there was an error, re-throw a more informative exception containing the MoMo error JSON
        if (responseCode >= 400) {
            throw new IOException("Server returned HTTP response code: " + responseCode + " for URL: " + url + ". MoMo Response Body: " + responseBody);
        }

        return responseBody;
    }
}