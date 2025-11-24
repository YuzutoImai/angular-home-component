import { Component } from '@angular/core';
import { Home } from './home/home';                  // ホームコンポーネントを読み込む（将来的に imports に追加可能）
import { RouterOutlet, RouterLink } from '@angular/router'; 
// RouterOutlet: ルーティングされたコンポーネントを表示するためのディレクティブ
// RouterLink: aタグなどでルート遷移するためのディレクティブ

@Component({
  selector: 'app-root',                             // このコンポーネントを HTML 内で <app-root> タグとして使用可能にする
  imports: [RouterOutlet, RouterLink],             // standalone コンポーネントで使用する外部モジュール／ディレクティブを指定
  template: `
    <main>
      <!-- クリックでホームページに遷移するリンク -->
      <a [routerLink]="['/']">                      <!-- RouterLink で '/' に遷移 -->
        <header class="brand-name">
          <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true" />
        </header>
      </a>

      <!-- ここにルーティングで切り替わるコンポーネントが表示される -->
      <section class="content">
        <router-outlet></router-outlet>             <!-- RouterOutlet ディレクティブ -->
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],                        // このコンポーネント専用の CSS ファイル
})
export class App {
  title = 'homes';                                  // コンポーネント内で使用できるプロパティ
}
