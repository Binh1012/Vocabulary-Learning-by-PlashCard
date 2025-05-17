package com.ck.flashcardapp1;


import android.content.Intent;
import android.os.Bundle;
import android.os.AsyncTask;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.ck.flashcardapp1.Database.AppDatabase;
import com.ck.flashcardapp1.Entity.Card;

import java.util.List;
import java.util.Random;

public class ViewCardActivity extends AppCompatActivity {
    private LinearLayout cardView;
    private TextView tvWord, tvWordType, tvMeaning;
    private Button btnLevel1, btnLevel2, btnLevel3, btnNextCard, btnEditCard, btnDeleteCard;
    private AppDatabase db;
    private long deckId, cardId;
    private Card currentCard;
    private List<Card> allCards;
    private boolean isDetailsVisible = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_card);

        cardView = findViewById(R.id.cardView);
        tvWord = findViewById(R.id.tvWord);
        tvWordType = findViewById(R.id.tvWordType);
        tvMeaning = findViewById(R.id.tvMeaning);
        btnLevel1 = findViewById(R.id.btnLevel1);
        btnLevel2 = findViewById(R.id.btnLevel2);
        btnLevel3 = findViewById(R.id.btnLevel3);
        btnNextCard = findViewById(R.id.btnNextCard);
        btnEditCard = findViewById(R.id.btnEditCard);
        btnDeleteCard = findViewById(R.id.btnDeleteCard);
        db = AppDatabase.getInstance(this);

        deckId = getIntent().getLongExtra("deckId", -1);
        cardId = getIntent().getLongExtra("cardId", -1);
        new LoadAllCardsTask().execute(deckId);

        cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!isDetailsVisible) {
                    tvWordType.setVisibility(View.VISIBLE);
                    tvMeaning.setVisibility(View.VISIBLE);
                    isDetailsVisible = true;
                } else {
                    tvWordType.setVisibility(View.GONE);
                    tvMeaning.setVisibility(View.GONE);
                    isDetailsVisible = false;
                }
            }
        });

        btnLevel1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentCard.setLevel(1);
                new UpdateCardTask().execute(currentCard);
                updateLevelButtons();
            }
        });

        btnLevel2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentCard.setLevel(2);
                new UpdateCardTask().execute(currentCard);
                updateLevelButtons();
            }
        });

        btnLevel3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentCard.setLevel(3);
                new UpdateCardTask().execute(currentCard);
                updateLevelButtons();
            }
        });

        btnNextCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (allCards.size() > 1) {
                    Random random = new Random();
                    Card nextCard;
                    do {
                        nextCard = allCards.get(random.nextInt(allCards.size()));
                    } while (nextCard.getId() == currentCard.getId());
                    cardId = nextCard.getId();
                    loadCard();
                } else {
                    Toast.makeText(ViewCardActivity.this, "Không có card nào khác!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        btnEditCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ViewCardActivity.this, AddEditCardActivity.class);
                intent.putExtra("deckId", deckId);
                intent.putExtra("cardId", cardId);
                startActivityForResult(intent, 1);
            }
        });

        btnDeleteCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DeleteCardTask().execute(cardId);
            }
        });
    }

    private void loadCard() {
        for (Card card : allCards) {
            if (card.getId() == cardId) {
                currentCard = card;
                break;
            }
        }
        tvWord.setText(currentCard.getWord());
        tvWordType.setText(currentCard.getWordType());
        tvMeaning.setText(currentCard.getMeaning());
        tvWordType.setVisibility(View.GONE);
        tvMeaning.setVisibility(View.GONE);
        isDetailsVisible = false;
        updateLevelButtons();
    }

    private void updateLevelButtons() {
        btnLevel1.setScaleX(1.0f);
        btnLevel1.setScaleY(1.0f);
        btnLevel2.setScaleX(1.0f);
        btnLevel2.setScaleY(1.0f);
        btnLevel3.setScaleX(1.0f);
        btnLevel3.setScaleY(1.0f);

        if (currentCard.getLevel() == 1) {
            btnLevel1.setScaleX(1.5f);
            btnLevel1.setScaleY(1.5f);
        } else if (currentCard.getLevel() == 2) {
            btnLevel2.setScaleX(1.5f);
            btnLevel2.setScaleY(1.5f);
        } else {
            btnLevel3.setScaleX(1.5f);
            btnLevel3.setScaleY(1.5f);
        }
    }

    private class LoadAllCardsTask extends AsyncTask<Long, Void, List<Card>> {
        @Override
        protected List<Card> doInBackground(Long... params) {
            return db.cardDao().getCardsByDeck(params[0]);
        }

        @Override
        protected void onPostExecute(List<Card> cards) {
            allCards = cards;
            loadCard();
        }
    }

    private class UpdateCardTask extends AsyncTask<Card, Void, Void> {
        @Override
        protected Void doInBackground(Card... cards) {
            db.cardDao().update(cards[0]);
            return null;
        }
    }

    private class DeleteCardTask extends AsyncTask<Long, Void, Void> {
        @Override
        protected Void doInBackground(Long... params) {
            db.cardDao().deleteCard(params[0]);
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            Toast.makeText(ViewCardActivity.this, "Xóa card thành công!", Toast.LENGTH_SHORT).show();
            setResult(RESULT_OK);
            finish();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == RESULT_OK) {
            new LoadAllCardsTask().execute(deckId);
        }
    }
}