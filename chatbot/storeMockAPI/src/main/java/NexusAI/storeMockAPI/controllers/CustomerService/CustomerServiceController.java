package NexusAI.storeMockAPI.controllers.CustomerService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/customer")
public class CustomerServiceController {
    
    @GetMapping("/manager")
    public String callManager() {
        return "The manager has been called and will be with you shortly";
    }

    @GetMapping("/employee")
    public String callEmployee() {
        return "The nearest employee has been called to assist you";
    }

}
