package com.ck.flashcardapp1;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.ck.flashcardapp1.Database.AppDatabase;
import com.ck.flashcardapp1.Entity.Deck;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AddDeckActivity extends AppCompatActivity {
    private EditText etDeckName;
    private Button btnSaveDeck;
    private AppDatabase db;
    private ExecutorService executorService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_deck);

        etDeckName = findViewById(R.id.etDeckName);
        btnSaveDeck = findViewById(R.id.btnSaveDeck);
        db = AppDatabase.getInstance(this);
        executorService = Executors.newSingleThreadExecutor();

        btnSaveDeck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String deckName = etDeckName.getText().toString().trim();
                if (!deckName.isEmpty()) {
                    Deck deck = new Deck();
                    deck.setName(deckName);
                    deck.setLastAccessed(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date()));
                    deck.setCardCount(0); // Đặt cardCount mặc định là 0
                    saveDeck(deck);
                } else {
                    Toast.makeText(AddDeckActivity.this, "Vui lòng nhập tên deck!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void saveDeck(Deck deck) {
        executorService.execute(() -> {
            try {
                db.deckDao().insert(deck);
                runOnUiThread(() -> {
                    Toast.makeText(AddDeckActivity.this, "Thêm deck thành công!", Toast.LENGTH_SHORT).show();
                    setResult(RESULT_OK);
                    finish();
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(AddDeckActivity.this, "Lỗi khi thêm deck: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executorService.shutdown();
    }
}