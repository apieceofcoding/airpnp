package com.apiece.airpnp;

import com.apiece.airpnp.domain.Stay;
import com.apiece.airpnp.domain.StayRepository;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
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
    private final List<Long> createdIds = new ArrayList<>();

    @AfterEach
    void cleanCreatedStays() {
        stayRepository.deleteAllById(createdIds);
    }

    @Test
    void listSerializesJavaObjectsToJson() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/api/stays")).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode json = objectMapper.readTree(response.body());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("content-type").orElse("")).contains("application/json");
        assertThat(json.size()).isEqualTo(9);
        assertThat(json.get(0).get("address").asText()).isNotBlank();
        assertThat(json.get(0).size()).isEqualTo(5);
    }

    @Test
    void createDeserializesJsonAndSavesStay() throws Exception {
        long countBefore = stayRepository.count();
        HttpResponse<String> response = post("""
            {"title":"바다 앞 숙소","address":"강릉시 해안로 123","pricePerNight":148000}
            """);
        JsonNode json = objectMapper.readTree(response.body());
        long id = json.get("id").asLong();
        createdIds.add(id);

        assertThat(response.statusCode()).isEqualTo(201);
        assertThat(response.headers().firstValue("location")).hasValue("/api/stays/" + id);
        assertThat(json.size()).isEqualTo(5);
        assertThat(json.get("title").asText()).isEqualTo("바다 앞 숙소");
        assertThat(json.get("address").asText()).isEqualTo("강릉시 해안로 123");
        assertThat(json.get("pricePerNight").isNumber()).isTrue();
        assertThat(json.get("pricePerNight").asInt()).isEqualTo(148000);
        assertThat(json.get("imageUrl").asText()).isEqualTo("/images/rooms/living.svg");
        assertThat(stayRepository.count()).isEqualTo(countBefore + 1);
        assertThat(stayRepository.findById(id)).isPresent()
            .get().extracting(Stay::getAddress).isEqualTo("강릉시 해안로 123");

        HttpResponse<String> detail = get("/api/stays/" + id);
        assertThat(detail.statusCode()).isEqualTo(200);
        assertThat(objectMapper.readTree(detail.body())).isEqualTo(json);
        assertThat(objectMapper.readTree(get("/api/stays").body()).size()).isEqualTo(countBefore + 1);
    }

    @Test
    void rejectsInvalidAndMalformedRequestsWithoutSaving() throws Exception {
        long countBefore = stayRepository.count();
        for (String body : List.of(
            "{",
            "{\"title\":\"  \",\"address\":\"강릉시\",\"pricePerNight\":100}",
            "{\"title\":\"숙소\",\"pricePerNight\":100}",
            "{\"title\":\"숙소\",\"address\":\"강릉시\",\"pricePerNight\":0}",
            "{\"title\":\"숙소\",\"address\":\"강릉시\",\"pricePerNight\":-1}",
            "{\"title\":\"숙소\",\"address\":\"강릉시\",\"pricePerNight\":148000.5}",
            "{\"title\":\"숙소\",\"address\":\"강릉시\",\"pricePerNight\":100000001}",
            "{\"title\":\"숙소\",\"address\":\"강릉시\",\"pricePerNight\":\"oops\"}",
            "{\"title\":\"숙소\",\"address\":\"  \",\"pricePerNight\":100}"
        )) {
            assertThat(post(body).statusCode()).isEqualTo(400);
        }
        assertThat(stayRepository.count()).isEqualTo(countBefore);
    }

    @Test
    void supportsBrowserPostPreflight() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/api/stays"))
            .header("Origin", "http://localhost:5173")
            .header("Access-Control-Request-Method", "POST")
            .header("Access-Control-Request-Headers", "content-type")
            .method("OPTIONS", HttpRequest.BodyPublishers.noBody())
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.headers().firstValue("access-control-allow-origin")).hasValue("http://localhost:5173");
    }

    @Test
    void missingStayReturnsNotFound() throws Exception {
        assertThat(get("/api/stays/999999").statusCode()).isEqualTo(404);
    }

    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(uri(path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> post(String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/api/stays"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }
}
