package com.krish.financeservice.service;

import com.google.gson.Gson;
import com.krish.financeservice.types.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * @author Krishantha Dinesh
 *         krishantha@krishantha.com
 *         www.krishantha.com
 *         youtube https://youtube.com/krish
 *         on 14-July-2022 02:08
 * @Project finance-service
 */

@Service
public class Consumer {

    @Autowired
    Producer producer;

    @KafkaListener(topics = "new-connection", groupId = "finance-group")
    public void readFromTopic(String message) throws InterruptedException {
        System.out.println("incomming message is " + message);
        Event event= new Gson().fromJson(message,Event.class);
        if(event.getType().equals("VERIFICATION_COMPLETE")){

            Thread.sleep(10000);
            producer.publishToTopic(new Event("finance-service","payment-complete",event.getKey(),"success"));
        }else{
            System.out.println("Event is not related to verification. process ignored");
        }


    }
}
