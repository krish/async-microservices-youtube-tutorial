package com.krish.financeservice.service;

import com.krish.financeservice.types.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * @author Krishantha Dinesh
 *         krishantha@krishantha.com
 *         www.krishantha.com
 *         youtube https://youtube.com/krish
 *         on 14-July-2022 02:06
 * @Project finance-service
 */
@Service
public class Producer {
    public static final String topic = "new-connection-response";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void publishToTopic(Event message) {
        System.out.println("publishing to " + topic);
        this.kafkaTemplate.send(topic, message.toString());

    }
}
