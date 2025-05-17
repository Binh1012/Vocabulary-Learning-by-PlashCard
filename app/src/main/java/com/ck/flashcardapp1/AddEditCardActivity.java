package com.ck.flashcardapp1;


import android.os.Bundle;
import android.os.AsyncTask;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.ck.flashcardapp1.Database.AppDatabase;
import com.ck.flashcardapp1.Entity.Card;

import java.util.List;

public class AddEditCardActivity extends AppCompatActivity {
    private TextView tvTitle;
    private EditText etWord, etWordType, etMeaning;
    private Button btnSaveCard;
    private AppDatabase db;
    private long deckId;
    private Card cardToEdit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_edit_card);

        tvTitle = findViewById(R.id.tvTitle);
        etWord = findViewById(R.id.etWord);
        etWordType = findViewById(R.id.etWordType);
        etMeaning = findViewById(R.id.etMeaning);
        btnSaveCard = findViewById(R.id.btnSaveCard);
        db = AppDatabase.getInstance(this);

        deckId = getIntent().getLongExtra("deckId", -1);
        long cardId = getIntent().getLongExtra("cardId", -1);

        if (cardId != -1) {
            tvTitle.setText("Chỉnh Sửa Card");
            new LoadCardTask().execute(deckId, cardId);
        }

        btnSaveCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String word = etWord.getText().toString();
                String wordType = etWordType.getText().toString();
                String meaning = etMeaning.getText().toString();

                if (!word.isEmpty() && !meaning.isEmpty()) {
                    if (cardToEdit == null) {
                        Card card = new Card();
                        card.setDeckId(deckId);
                        card.setWord(word);
                        card.setWordType(wordType);
                        card.setMeaning(meaning);
                        card.setLevel(1);
                        new InsertCardTask().execute(card);
                    } else {
                        cardToEdit.setWord(word);
                        cardToEdit.setWordType(wordType);
                        cardToEdit.setMeaning(meaning);
                        new UpdateCardTask().execute(cardToEdit);
                    }
                } else {
                    Toast.makeText(AddEditCardActivity.this, "Vui lòng điền từ và nghĩa!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private class LoadCardTask extends AsyncTask<Long, Void, Card> {
        @Override
        protected Card doInBackground(Long... params) {
            long deckId = params[0];
            long cardId = params[1];
            List<Card> cards = db.cardDao().getCardsByDeck(deckId);
            for (Card card : cards) {
                if (card.getId() == cardId) {
                    return card;
                }
            }
            return null;
        }

        @Override
        protected void onPostExecute(Card card) {
            cardToEdit = card;
            if (cardToEdit != null) {
                etWord.setText(cardToEdit.getWord());
                etWordType.setText(cardToEdit.getWordType());
                etMeaning.setText(cardToEdit.getMeaning());
            }
        }
    }

    private class InsertCardTask extends AsyncTask<Card, Void, Void> {
        @Override
        protected Void doInBackground(Card... cards) {
            db.cardDao().insert(cards[0]);
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            Toast.makeText(AddEditCardActivity.this, "Thêm card thành công!", Toast.LENGTH_SHORT).show();
            setResult(RESULT_OK);
            finish();
        }
    }

    private class UpdateCardTask extends AsyncTask<Card, Void, Void> {
        @Override
        protected Void doInBackground(Card... cards) {
            db.cardDao().update(cards[0]);
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            Toast.makeText(AddEditCardActivity.this, "Cập nhật card thành công!", Toast.LENGTH_SHORT).show();
            setResult(RESULT_OK);
            finish();
        }
    }
}
