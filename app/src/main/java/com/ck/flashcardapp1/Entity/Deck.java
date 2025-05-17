package com.ck.flashcardapp1.Entity;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
//import androidx.room.vo.Entity;
import androidx.room.vo.Entity;
@Entity(tableName = "deck")
public class Deck {
    @PrimaryKey(autoGenerate = true)
    private long id;
    private String name;
    private String lastAccessed;
    private int cardCount; // Thêm trường này để lưu số lượng Card

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastAccessed() {
        return lastAccessed;
    }

    public void setLastAccessed(String lastAccessed) {
        this.lastAccessed = lastAccessed;
    }

    public int getCardCount() {
        return cardCount;
    }

    public void setCardCount(int cardCount) {
        this.cardCount = cardCount;
    }

    @Override
    public String toString() {
        return name;
    }
}