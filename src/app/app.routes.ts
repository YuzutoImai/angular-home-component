import { Routes } from '@angular/router';
import { Details } from './details/details';
import { Home } from './home/home';

/**
 * Angular アプリの「ルーティング設定」を定義するファイルです。
 *
 * ルーティングとは、ユーザーがアクセスした URL に応じて
 * どのコンポーネントを表示するかを Angular に教える仕組みです。
 *
 * 下の `routes` 配列では、アプリ内の URL と表示するコンポーネントを
 * 対応付けています。
 */
export const routes: Routes = [

  /**
   * ホームページ（/）
   *
   * path: '' はルート URL（http://localhost:4200/）を表し、
   * ユーザーがアプリを開いたときに最初に表示されるページです。
   * Home コンポーネントを画面に表示します。
   */
  { path: '', component: Home, title: 'Home page' },

  /**
   * 詳細ページ（/details/ID）
   *
   * path: 'details/:id' はパラメータ付きルート。
   * 例）/details/3 → Details コンポーネントを表示し、id=3 を渡す。
   *
   * クリックした住宅の詳細情報を表示するページです。
   */
  { path: 'details/:id', component: Details, title: 'Home details' }

];
