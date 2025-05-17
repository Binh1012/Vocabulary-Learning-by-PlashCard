package com.ck.flashcardapp1;


import android.content.Intent;
import android.os.Bundle;
import android.os.AsyncTask;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.ck.flashcardapp1.Database.AppDatabase;
import com.ck.flashcardapp1.Entity.Card;

import java.util.ArrayList;
import java.util.List;

public class CardListActivity extends AppCompatActivity {
    private TextView tvDeckName;
    private EditText etSearchCard;
    private ListView lvCards;
    private Button btnAddCard, btnEditDeck, btnDeleteDeck;
    private AppDatabase db;
    private ArrayAdapter<Card> cardAdapter;
    private long deckId;
    private List<Card> allCards;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_card_list);

        tvDeckName = findViewById(R.id.tvDeckName);
        etSearchCard = findViewById(R.id.etSearchCard);
        lvCards = findViewById(R.id.lvCards);
        btnAddCard = findViewById(R.id.btnAddCard);
        btnEditDeck = findViewById(R.id.btnEditDeck);
        btnDeleteDeck = findViewById(R.id.btnDeleteDeck);
        db = AppDatabase.getInstance(this);

        deckId = getIntent().getLongExtra("deckId", -1);
        String deckName = getIntent().getStringExtra("deckName");
        tvDeckName.setText(deckName);

        loadCards();

        btnAddCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CardListActivity.this, AddEditCardActivity.class);
                intent.putExtra("deckId", deckId);
                startActivityForResult(intent, 1);
            }
        });

        btnEditDeck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CardListActivity.this, AddDeckActivity.class);
                intent.putExtra("deckId", deckId);
                intent.putExtra("deckName", deckName);
                startActivityForResult(intent, 2);
            }
        });

        btnDeleteDeck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DeleteDeckTask().execute(deckId);
            }
        });

        lvCards.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Card selectedCard = (Card) parent.getItemAtPosition(position);
                Intent intent = new Intent(CardListActivity.this, ViewCardActivity.class);
                intent.putExtra("deckId", deckId);
                intent.putExtra("cardId", selectedCard.getId());
                startActivityForResult(intent, 3);
            }
        });

        etSearchCard.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchCards(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void loadCards() {
        new LoadCardsTask().execute(deckId);
    }

    private void searchCards(String query) {
        new SearchCardsTask().execute(query, deckId);
    }

    private class LoadCardsTask extends AsyncTask<Long, Void, List<Card>> {
        @Override
        protected List<Card> doInBackground(Long... params) {
            return db.cardDao().getCardsByDeck(params[0]);
        }

        @Override
        protected void onPostExecute(List<Card> cards) {
            allCards = cards;
            cardAdapter = new ArrayAdapter<Card>(CardListActivity.this, android.R.layout.simple_list_item_1, allCards) {
                @Override
                public View getView(int position, View convertView, android.view.ViewGroup parent) {
                    TextView textView = (TextView) super.getView(position, convertView, parent);
                    Card card = getItem(position);
                    textView.setText(card.getWord() + " (" + card.getWordType() + ") - " + card.getMeaning());
                    return textView;
                }
            };
            lvCards.setAdapter(cardAdapter);
        }
    }

    private class SearchCardsTask extends AsyncTask<Object, Void, List<Card>> {
        @Override
        protected List<Card> doInBackground(Object... params) {
            String query = (String) params[0];
            long deckId = (long) params[1];
            return db.cardDao().searchCards(query, deckId);
        }

        @Override
        protected void onPostExecute(List<Card> cards) {
            cardAdapter = new ArrayAdapter<Card>(CardListActivity.this, android.R.layout.simple_list_item_1, cards) {
                @Override
                public View getView(int position, View convertView, android.view.ViewGroup parent) {
                    TextView textView = (TextView) super.getView(position, convertView, parent);
                    Card card = getItem(position);
                    textView.setText(card.getWord() + " (" + card.getWordType() + ") - " + card.getMeaning());
                    return textView;
                }
            };
            lvCards.setAdapter(cardAdapter);
        }
    }

    private class DeleteDeckTask extends AsyncTask<Long, Void, Void> {
        @Override
        protected Void doInBackground(Long... params) {
            db.deckDao().deleteDeck(params[0]);
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            Toast.makeText(CardListActivity.this, "Xóa deck thành công!", Toast.LENGTH_SHORT).show();
            setResult(RESULT_OK);
            finish();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if ((requestCode == 1 || requestCode == 2 || requestCode == 3) && resultCode == RESULT_OK) {
            loadCards();
        }
    }
}
