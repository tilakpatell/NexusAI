package NexusAI.storeMockAPI.controllers.ThreatDetection;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/threat")
public class ThreatDetectionController {
    
    @GetMapping("/911")
    public String call911() {
        return "Calling 911";
    }

    @GetMapping("/detected")
    public String threatDetected() {
        return "You are being recorded and reported to the local authorities";
    }

    @GetMapping("/evacuate")
    public String evacuate() {
        return "Danger! Please evacuate the surroundings immediately";
    }

}
