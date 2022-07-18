package com.krish.financeservice.types;

/**
 * @author Krishantha Dinesh
 *         krishantha@krishantha.com
 *         www.krishantha.com
 *         youtube https://youtube.com/krish
 *         on 14-July-2022 02:39
 * @Project finance-service
 */
public class Event {

   private String from;
    private String type;
    private  String key;
    private  String result;


    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Event(String from, String type, String key, String result) {
        this.from = from;
        this.type = type;
        this.key = key;
        this.result = result;
    }
    @Override
    public String toString() {
        return "{\"from\":" + "\"" + from + "\"" + ",\"type\":" + "\"" + type + "\"" +",\"key\":" + "\"" + key + "\""+ ",\"result\":" + "\"" + result + "\""+"}";
    }
}
