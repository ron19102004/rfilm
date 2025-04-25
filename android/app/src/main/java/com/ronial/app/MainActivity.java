package com.ronial.app;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebChromeClient;
import android.widget.FrameLayout;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    private FrameLayout mContentView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ✅ Force full screen (status bar + navigation bar)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }

        // ✅ Lấy contentView chính xác sau khi BridgeActivity đã khởi tạo
        mContentView = (FrameLayout) getWindow().getDecorView().findViewById(android.R.id.content);

        // ✅ Xử lý WebView fullscreen cho iframe (VD: video)
        getBridge().getWebView().setWebChromeClient(new WebChromeClient() {
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (mCustomView != null) {
                    callback.onCustomViewHidden();
                    return;
                }

                mCustomView = view;
                mCustomViewCallback = callback;

                // ✅ Thêm custom view vào full layout
                mContentView.addView(
                        mCustomView,
                        new FrameLayout.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT,
                                ViewGroup.LayoutParams.MATCH_PARENT
                        )
                );

                getBridge().getWebView().setVisibility(View.GONE);
            }

            @Override
            public void onHideCustomView() {
                if (mCustomView == null) return;

                mContentView.removeView(mCustomView);
                mCustomView = null;
                if (mCustomViewCallback != null) {
                    mCustomViewCallback.onCustomViewHidden();
                }

                getBridge().getWebView().setVisibility(View.VISIBLE);
            }
        });
    }
}
