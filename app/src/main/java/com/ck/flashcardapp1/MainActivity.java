package com.ck.flashcardapp1;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ck.flashcardapp1.Database.AppDatabase;
import com.ck.flashcardapp1.Entity.Deck;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity implements DeckAdapter.OnDeckClickListener {
    private EditText etSearchDeck;
    private RecyclerView rvDecks;
    private Button btnAddDeck;
    private AppDatabase db;
    private DeckAdapter deckAdapter;
    private ExecutorService executorService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etSearchDeck = findViewById(R.id.etSearchDeck);
        rvDecks = findViewById(R.id.rvDecks);
        btnAddDeck = findViewById(R.id.btnAddDeck);
        db = AppDatabase.getInstance(this);
        executorService = Executors.newSingleThreadExecutor();

        // Thiết lập RecyclerView
        rvDecks.setLayoutManager(new LinearLayoutManager(this));
        deckAdapter = new DeckAdapter(this);
        rvDecks.setAdapter(deckAdapter);

        loadDecks();

        btnAddDeck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, AddDeckActivity.class);
                startActivityForResult(intent, 1);
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
                for (Deck deck : decks) {
                    deck.setCardCount(db.deckDao().getCardCount(deck.getId()));
                }
                runOnUiThread(() -> {
                    deckAdapter.setDecks(decks);
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
                for (Deck deck : decks) {
                    deck.setCardCount(db.deckDao().getCardCount(deck.getId()));
                }
                runOnUiThread(() -> {
                    deckAdapter.setDecks(decks);
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "Lỗi khi tìm kiếm deck: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
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
    public void onDeckClick(Deck deck) {
        updateLastAccessed(deck);
        Intent intent = new Intent(MainActivity.this, CardListActivity.class);
        intent.putExtra("deckId", deck.getId());
        intent.putExtra("deckName", deck.getName());
        startActivityForResult(intent, 2);
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