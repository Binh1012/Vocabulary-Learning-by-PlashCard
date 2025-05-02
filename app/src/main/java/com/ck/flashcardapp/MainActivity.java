package com.ck.flashcardapp;

import android.content.Intent;
import android.os.Bundle;
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

import com.ck.flashcardapp.Database.AppDatabase;
import com.ck.flashcardapp.Entity.Deck;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {
    private EditText etSearchDeck;
    private ListView lvDecks;
    private Button btnAddDeck;
    private AppDatabase db;
    private ArrayAdapter<Deck> deckAdapter;
    private List<Deck> allDecks;
    private ExecutorService executorService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etSearchDeck = findViewById(R.id.etSearchDeck);
        lvDecks = findViewById(R.id.lvDecks);
        btnAddDeck = findViewById(R.id.btnAddDeck);
        db = AppDatabase.getInstance(this);
        executorService = Executors.newSingleThreadExecutor();

        loadDecks();

        btnAddDeck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, AddDeckActivity.class);
                startActivityForResult(intent, 1);
            }
        });

        lvDecks.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Deck selectedDeck = (Deck) parent.getItemAtPosition(position);
                updateLastAccessed(selectedDeck);
                Intent intent = new Intent(MainActivity.this, CardListActivity.class);
                intent.putExtra("deckId", selectedDeck.getId());
                intent.putExtra("deckName", selectedDeck.getName());
                startActivityForResult(intent, 2);
            }
        });

        etSearchDeck.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchDecks(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void loadDecks() {
        executorService.execute(() -> {
            try {
                List<Deck> decks = db.deckDao().getAllDecks();
                runOnUiThread(() -> {
                    allDecks = decks;
                    deckAdapter = new ArrayAdapter<Deck>(MainActivity.this, android.R.layout.simple_list_item_1, allDecks) {
                        @Override
                        public View getView(int position, View convertView, android.view.ViewGroup parent) {
                            TextView textView = (TextView) super.getView(position, convertView, parent);
                            Deck deck = getItem(position);
                            int cardCount = getCardCount(deck.getId());
                            textView.setText(deck.getName() + " (" + cardCount + " card)");
                            return textView;
                        }
                    };
                    lvDecks.setAdapter(deckAdapter);
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "Lỗi khi tải danh sách deck: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void searchDecks(String query) {
        executorService.execute(() -> {
            try {
                List<Deck> decks = db.deckDao().searchDecks(query);
                runOnUiThread(() -> {
                    deckAdapter = new ArrayAdapter<Deck>(MainActivity.this, android.R.layout.simple_list_item_1, decks) {
                        @Override
                        public View getView(int position, View convertView, android.view.ViewGroup parent) {
                            TextView textView = (TextView) super.getView(position, convertView, parent);
                            Deck deck = getItem(position);
                            int cardCount = getCardCount(deck.getId());
                            textView.setText(deck.getName() + " (" + cardCount + " card)");
                            return textView;
                        }
                    };
                    lvDecks.setAdapter(deckAdapter);
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "Lỗi khi tìm kiếm deck: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private int getCardCount(long deckId) {
        try {
            return db.deckDao().getCardCount(deckId);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    private void updateLastAccessed(Deck deck) {
        executorService.execute(() -> {
            try {
                deck.setLastAccessed(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date()));
                db.deckDao().update(deck);
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "Lỗi khi cập nhật thời gian truy cập: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if ((requestCode == 1 || requestCode == 2) && resultCode == RESULT_OK) {
            loadDecks();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executorService.shutdown();
    }
}