// ────────────────────────────────────────────────────────────────
// main.ts — アプリのエントリポイント / ブートストラップの設定
// このファイルはアプリ起動時に一度だけ実行され、
// ここで「何を起動するか（App コンポーネント）」と「アプリ全体の設定（providers）」を決める。
// ────────────────────────────────────────────────────────────────

/**
 * bootstrapApplication:
 * - Angular の standalone / tree-shakable bootstrap 用の関数。
 * - これに最上位コンポーネント（App）を渡すとアプリが起動する。
 * - NgModule を使わないモダンな起動方法（Angular 14 以降で推奨されるパターン）。
 */
import { bootstrapApplication } from '@angular/platform-browser';

/**
 * importProvidersFrom:
 * - 既存の NgModule（例: HttpClientModule）に含まれる providers を
 *   providers 配列として取り込む際に使うヘルパー関数。
 * - standalone アプリでモジュール由来の provider を使いたいときに便利。
 */
import { importProvidersFrom } from '@angular/core';

/**
 * provideRouter:
 * - ルーティングを有効にするためのファクトリ関数。
 * - 引数にルート設定（routes）を渡すと Router が初期化され、
 *   <router-outlet> / routerLink / ActivatedRoute などが使えるようになる。
 */
import { provideRouter } from '@angular/router';

/**
 * App:
 * - ブートストラップする最上位コンポーネント（src/app/app.ts の App）。
 * - このコンポーネントがアプリ全体のルート UI を担う。
 */
import { App } from './app/app';

/**
 * routes:
 * - 先に定義したルート設定（例: app.routes.ts）を読み込む。
 * - provideRouter(routes) の引数として渡すことでルーターに登録される。
 */
import { routes } from './app/app.routes'; // ← ここで定義済みのルート一覧を読み込む

/**
 * appConfig:
 * - プロジェクト独自の共通設定（providers など）をまとめたオブジェクト。
 * - 例えば global な providers（テーマ、i18n、共通エラー処理など）をまとめておける。
 * - なくても良いが、設定を分離して main.ts を短く保つために使うパターン。
 */
import { appConfig } from './app/app.config';

// ────────────────────────────────────────────────────────────────
// ブートストラップ実行：ここからアプリが起動する
// ────────────────────────────────────────────────────────────────
bootstrapApplication(App, {
  // appConfig を展開して、あらかじめまとめた設定を取り込む
  // (例: appConfig = { providers: [ ... ] })
  ...appConfig,

  // providers は「このアプリで使えるサービス／機能」を登録する場所
  providers: [
    // appConfig に providers が既にあればそれを展開して維持する（上書きしない）
    ...(appConfig.providers || []),

    /**
     * ルーターを登録
     * - provideRouter(routes) を providers に渡すことで、
     *   Angular の Router がアプリ内で利用可能になる。
     * - これにより <router-outlet> や routerLink、Router サービスなどが動く。
     *
     * 補足：
     * - routes は app.routes.ts の配列（path ↔ component のマッピング）
     * - もし provideRouter を入れ忘れると、ルーティング関連の DI が解決できずエラーになる
     *   （例: RouterLink で "No provider for Router" など）。
     */
    provideRouter(routes),

    /**
     * ここに他の providers を追加することもできます。
     * 以下はよく使う例（コメント解除して使う）：
     *
     * // 例：HttpClientModule の providers を取り込む（API 呼び出し用）
     * importProvidersFrom(HttpClientModule),
     *
     * // 例：起動時に何か同期／非同期の初期化処理を実行したい場合
     * { provide: APP_INITIALIZER, useFactory: initAppFactory, deps: [SomeService], multi: true }
     *
     * // 例：カスタムエラーハンドラ
     * { provide: ErrorHandler, useClass: GlobalErrorHandler }
     */
  ]
})
// ブートストラップ中に例外が発生したらキャッチしてコンソールに出力する
.catch(err => console.error(err));

/* ===================================================================
   追加補足（実務でよく使うパターン）
   ===================================================================

1) HttpClient を使いたい場合（API 呼び出し）：
   standalone アプリでは HttpClientModule を NgModule 経由で取り込めないので
   importProvidersFrom を使って providers に追加します。

   例：
   import { HttpClientModule } from '@angular/common/http';
   ...
   providers: [
     ...(appConfig.providers || []),
     provideRouter(routes),
     importProvidersFrom(HttpClientModule),
   ]

   これで HttpClient が DI 可能になります（コンポーネント／サービス内で constructor(private http: HttpClient)）。

2) APP_INITIALIZER（アプリ起動時に非同期初期化が必要な場合）：
   たとえば、設定をサーバから読み込んでからアプリを表示したい時など。

   例：
   import { APP_INITIALIZER } from '@angular/core';
   import { SettingsService } from './app/settings.service';

   export function initFactory(settings: SettingsService) {
     return () => settings.load(); // Promise を返す
   }

   providers: [
     ...(appConfig.providers || []),
     provideRouter(routes),
     importProvidersFrom(HttpClientModule),
     { provide: APP_INITIALIZER, useFactory: initFactory, deps: [SettingsService], multi: true }
   ]

   ※ APP_INITIALIZER のファクトリはアプリ起動時に呼ばれ、Promise が解決されるまで
     bootstrap は待機する（初期データを取得してから UI を表示したいケースに有効）。

3) NgModule ベースのアプリとの違い（補足）：
   - 以前の Angular（NgModule を使うパターン）では AppModule に RouterModule.forRoot(routes) や
     HttpClientModule を import していました。
   - standalone ブートストラップでは main.ts に providers を直接渡す（より明示的で tree-shakable）。

4) デバッグのヒント：
   - もし `<router-outlet>` に何も表示されない場合：
     - routes の export/import が正しいか（相対パス、名前）を確認
     - provideRouter(routes) が providers に含まれているか確認
   - RouterLink 関連エラーが出る場合は、Router がプロバイダ登録されていない可能性が高いです。

=================================================================== */
