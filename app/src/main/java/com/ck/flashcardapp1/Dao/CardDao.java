package com.ck.flashcardapp1.Dao;


import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.ck.flashcardapp1.Entity.Card;

import java.util.List;

@Dao
public interface CardDao {
    @Insert
    long insert(Card card);

    @Update
    void update(Card card);

    @Query("SELECT * FROM card WHERE deckId = :deckId")
    List<Card> getCardsByDeck(long deckId);

    @Query("SELECT * FROM card WHERE word LIKE '%' || :query || '%' AND deckId = :deckId")
    List<Card> searchCards(String query, long deckId);

    @Query("DELETE FROM card WHERE id = :cardId")
    void deleteCard(long cardId);
}