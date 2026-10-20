package com.apiece.airpnp;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class JsonHttpTests {

    @LocalServerPort
    private int port;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StayRepository stayRepository;

    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void listSerializesJavaObjectsToJson() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/api/stays")).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode json = objectMapper.readTree(response.body());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse("")).contains("application/json");
        assertThat(json.size()).isEqualTo(9);
        assertThat(json.get(0).get("rating").asDouble()).isEqualTo(5.0);
    }

    @Test
    void previewDeserializesRequestAndSerializesResponseWithoutSaving() throws Exception {
        long countBefore = stayRepository.count();
        String body = """
            {"title":"바다 앞 숙소","pricePerNight":148000}
            """;
        HttpResponse<String> response = post(body);
        JsonNode json = objectMapper.readTree(response.body());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse("")).contains("application/json");
        assertThat(json.get("title").asText()).isEqualTo("바다 앞 숙소");
        assertThat(json.get("pricePerNight").isNumber()).isTrue();
        assertThat(json.get("pricePerNight").asInt()).isEqualTo(148000);
        assertThat(stayRepository.count()).isEqualTo(countBefore);
    }

    @Test
    void malformedJsonIsRejectedBeforeControllerRuns() throws Exception {
        assertThat(post("{").statusCode()).isEqualTo(400);
    }

    private HttpResponse<String> post(String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/api/stays/preview"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }
}
