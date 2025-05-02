package com.ck.flashcardapp.Entity;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "deck")
public class Deck {
    @PrimaryKey(autoGenerate = true)
    private long id;
    private String name;
    private String lastAccessed;

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

    @Override
    public String toString() {
        return name;
    }
}