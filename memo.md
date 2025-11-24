C+x,C+Fでファイル名検索
C+sでファイル内検索

--
- assetsに追加する場合はangular.jsonにパスの許可を書く。
- styles.css に書くと グローバル CSS として全コンポーネントに適用される。
- 各コンポーネントの styleUrls に書くと そのコンポーネント専用の CSS になる。

- interface や型定義ファイル（housinglocation.ts など）は モデル (model) と呼ぶ。
データの構造や型を定義するだけで UI ロジックは持たない。

親子コンポーネント間のデータ
@Input() は 子コンポーネント に書く。
親コンポーネントから子コンポーネントへデータを渡すために使う。
例：
// 子 component
@Input() housingLocation: HousingLocationInfo;
<!-- 親 component の template -->
<app-housing-location [housingLocation]="someLocation"></app-housing-location>

[src]="housingLocation().photo" の意味
[src]
HTML の src 属性を Angular のデータにバインドすることを意味します。
[] で囲むと「プロパティバインディング」になり、値が動的に反映されます。



1️⃣ モデル（Model）＝ メニューの定義（データの型）

「この店ではハンバーグはこういう形のデータだよ！」
という データの設計図。

例）HousingLocationInfo（家の情報）

export interface HousingLocationInfo {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
}


これは「家の情報ってこういう項目があるよ」という 型の説明だけ。
「値」は持っていない。

👉 設計図なのでロジックも画面も持たない。
👉 imports に入れてはいけない。

2️⃣ サービス（Service）＝ キッチン（データを作る場所）

データを持っていて、必要な時に提供してくれる場所。

家の一覧を返す

特定の id の家を返す

サーバー（API）からデータを取得する
（後でそうなる）

例：

@Injectable({ providedIn: 'root' })
export class HousingService {
  housingLocationList: HousingLocationInfo[] = [
    { id: 1, name: 'Sample Home', city: 'Tokyo', ... }
  ];

  getAllHousingLocations() {
    return this.housingLocationList;
  }
}


👉 役割：データを管理して渡すこと
👉 画面は持たない
👉 UI とは無関係

3️⃣ コンポーネント（Component）＝ お店の店員（画面を表示する）

あなたがブラウザで見ている「画面」を作るのがコンポーネント。

HTML（表示）

CSS（見た目）

TypeScript（画面のロジック）

例：

@Component({...})
export class Home {
  housingLocationList = [];
  housingService = inject(HousingService);

  constructor() {
    this.housingLocationList =
      this.housingService.getAllHousingLocations();
  }
}


👉 画面で使うデータをサービスからもらう
👉 HTMLに表示する
👉 親子コンポーネントでデータを渡し合う


--

@Injectable({ providedIn: 'root' }) は Angular の依存性注入（DI）システムに、このサービスをアプリ全体で使えるように登録する設定 です。

✅ @Injectable({ providedIn: 'root' }) の意味

**Angular に「このサービスはアプリ全体で共有して使ってね」**と指示している。

サービスの インスタンス（中身）は 1 つだけ 作られる（シングルトン）。

どのコンポーネントからも注入（DI）できる。

🔍 もう少し分かりやすく説明
例えるなら…

サービス = 共有データ倉庫

providedIn: 'root' = その倉庫をアプリ全体に公開する

アプリのどこからでも同じデータを読んだり書いたりできる。

✨ なぜ必要なの？

Angular ではコンポーネント間でデータを共有したいとき、
サービスを使って共通データを持たせるのが基本です。

そのためには、サービスを DI コンテナに登録する必要があります。

✔ 登録方法の1つがこれ
@Injectable({
  providedIn: 'root'
})
export class HousingService { ... }


これにより Angular は：

アプリ起動時にサービスを準備する

どこでも依存性注入できる

同じインスタンスが使われ続ける

🎯 どうやって使うの？

コンポーネントでサービスを注入して使う：

constructor(private housingService: HousingService) {}

ngOnInit() {
  this.housingList = this.housingService.getAllHousingLocations();
}

📝 まとめ
設定	意味
@Injectable	このクラスは DI できるよ
providedIn: 'root'	アプリ全体で 1 つのサービスを共有するよ（シングルトン）