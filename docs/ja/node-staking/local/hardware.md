# Staking Hardware の選択

Rocket Pool nodeを実行するための公式な仕様はありません。
このページでは、staking hardwareを選択する際に使用できるガイドラインと例を提供します。

nodeの最小ハードウェア要件は、選択するConsensusクライアントとExecutionクライアントによって異なります。
例えば、低電力デバイスでnodeを実行する場合、Executionクライアントとして`Geth`を、Consensusクライアントとして`Nimbus`を使用することに制限される可能性があります。
32GB以上のRAMを搭載したより強力なNUCを使用している場合は、すべてのクライアントの組み合わせが利用可能です。

以下のガイドラインは、**快適な**レベルのハードウェアを求めていることを前提としています。つまり、余剰容量があることを意味します。
これらのガイドラインを念頭に置けば、nodeはRocket Poolがサポートするあらゆるクライアントの組み合わせを実行するのに十分なリソースを持つことになります。
これにより、`random`クライアントペアを選択できるようになり、Ethereumネットワークのクライアントの多様性にとって非常に重要です。

::: tip NOTE
Ethereumのstakingは非常に寛容です。
家が洪水で浸水してstakingデバイスが壊れても、1週間かけて復旧させても大きなペナルティはありません(sync committeeに参加している場合を除きますが、これは非常にまれなイベントです)。
コンポーネントの故障は時々発生する可能性がありますが、心配する必要はありません。
ダウンタイムによってスラッシュされることはありません。ただし、Ethereumネットワーク全体の大規模な停止中にオフラインになっている場合を除きます。
:::

## ハードウェア要件

Ethereumのvalidatorは計算コストがそれほど高くありません。つまり、ExecutionクライアントとConsensusクライアントが実行されると、追加のvalidatorは**非常に少量の追加リソース**しか使用しません。
これは64 validatorまで成長し、その時点で65番目以降のvalidatorを追加するために必要なリソースはわずかです。

私たちの経験では、mini-PCやNUCを含むほとんどのセットアップは、事実上無制限の数のvalidatorを実行できます。

### CPU要件

**ガイドライン: 少なくとも4スレッドを持つ最新のCPU**

Rocket Pool nodeの実行は、計算集約的ではありません。
CPUの最大の影響は、最初に作成したとき(または後でクライアントを変更した場合)に、nodeがブロックチェーンの状態を初期同期する速度です。
初期同期後は、CPUはそれほど多く使用されません。

CPUの名称は欺瞞的である可能性があります。2010年のIntel Core i5は通常、2022年のcore i3よりも**パワーが低い**です。
多くのコミュニティメンバーは、小型フォームファクターのためにIntel NUCデバイスを使用していますが、古いi5 NUCは新しいi3よりも悪い選択かもしれません。
このため、せいぜい数年前の「最新の」CPUを使用することをお勧めします。
より具体的には、**x64ベースのCPUの場合**、[BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>)拡張をサポートするCPUをお勧めします。CPUの製造元の仕様を確認して、サポートされているかどうかを確認してください。
すべての最新のCPUがこれをサポートしているわけではありません。例えば、Celeron CPUは一般的にこれを含んでいません。

ARMベースのCPU(Mac M1やM2、Rock 5Bなど)は、上記のBMI2拡張には適用されません。

::: tip NOTE
NUCの使用を検討している場合、NUCがどれくらい最新かはモデル番号で判断できます。
フォーマットは`NUC` + `世代番号` + `モデル` + `CPUタイプ` + `サフィックス`です。
例えば、`NUC11PAHi50Z`ユニットは第11世代のi5ユニットです。
NUCのリストは、Intelのウェブサイトで[こちら](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html)で確認できます。

Asus PN50やPN51などの他のmini-PCは、この規則に従っていませんが、使用されているCPUに関する情報は製品ページに記載されているはずです。
:::

CPUのコア数は、**スレッド数**よりも関連性が低いです。
Rocket Pool node運用には**最低4スレッド**をお勧めします。
4スレッドを持つ2コアCPUは問題なく動作します。
2スレッドしかないCPUを見つけることはまれです。

### RAM要件

**ガイドライン: 最低16GBのRAM、32GBが望ましい、DDR4が望ましい**

Rocket Pool nodeは16GBのRAMで動作できます。
一般的には、若干多めにすることで余裕を持たせ、Tekuのようなメモリを大量に使用するクライアントを完全にサポートできるようにすることをお勧めします。
より多くのRAMの追加の利点は、Executionクライアントにより大きなキャッシュサイズを提供できることです。これにより、ディスクスペースの使用率の増加を遅くする傾向があります。

### SSD要件

**ガイドライン: TLC以上の2TB以上のSSDで、DRAMキャッシュ付き。NVMe推奨**

この要素は、ほとんどの人が期待するよりも重要です。
Executionクライアントは、IOPS(1秒あたりの操作数)に大きく依存しています。15k Read IOPS、5k Write IOPSをお勧めします。
実際には、これは次のことを意味します。

- HDD(回転プラッター)ドライブは機能しません
- SATAまたは外部USB 3.0+ SSDは_動作可能です_
- NVMe SSDドライブが推奨されます

既に使用したいSSDがあり、node運用に十分なパフォーマンスがあるかどうかを確認したい場合。

_\* ディスクがこれらのパフォーマンス要件を満たしているかどうか不明な場合、`fio`はそれらをテストする良い方法です。
Linuxの手順については[こちら](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/)を、
MacOSの手順については[こちら](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/)を参照してください。_

:::tip NOTE
SSDの選択は複雑な選択になる可能性があります。

SSDがフラッシュチップにデータを保存する方法は、速度と寿命に顕著な影響を与えます。
SSDを購入する際、`QLC`、`TLC`、`SLC`のようなラベルに気付くかもしれません。
これらは、フラッシュチップの単一セル内に含まれるデータ量を表します。`Q`は「quad」で4、`T`は「triple」で3、`M`は「multi」で2、`S`は「single」で1を意味します。

**TLC、MLC、またはSLC**ドライブをお勧めします。
パフォーマンスが遅く、総合的な信頼性が低いため、**QLCドライブはお勧めしません**。

SSDにはDRAM付きとDRAMなしがあります。DRAMはSSD上のデータへのアクセスをより効率的にするハードウェア要素です。
DRAM付きの方が高速ですが、DRAMなしの方が安価です。
しかし、DRAMはスムーズなnode運用を提供するために非常に重要です。

**DRAM**キャッシュ付きのドライブをお勧めします。
**DRAMレスドライブはお勧めしません**。
:::

最後の考慮事項は、ドライブのサイズです。
2024年10月時点で、`geth` executionクライアントデータベースサイズは、初期同期が完了した後(またはプルーニングが完了した直後)に約1.2TBのスペースが必要です。
これは時間とともに着実に増加し、プルーニングによって一部のスペースを取り戻すことができますが、新しくプルーニングされた状態は_時間とともに_成長します。
より大きなドライブを使用すれば、安心できます。

### 一般的なアクセサリー

多くのnode operatorは、最小要件を超えてセットアップを改善しています。
一般的な追加要素には以下が含まれます。

- ドライブの寿命を延ばすためのSSDヒートシンク
- 停電時のための無停電電源装置(UPS)
- 何かが故障した場合のバックアップとしてのフォールバックnode

これらはすべて便利ですが、Rocket Pool nodeを実行するために必須ではありません。

## セットアップ例

このセクションでは、Rocket Poolのコミュニティが自分たちのために作成した様々なビルドのいくつかを紹介します。
これらは人々が使用しているものの例であり、セットアップを実行する方法の推奨ではありません。
多くは若干古く、例えば現在では小さすぎるSSDを使用していることに注意してください。

### Xer0のサーバー

![](./images/Xer0.jpg)

Discordユーザー**Xer0**は、stakingマシンに従来のPCフォームファクターを選択した多くのstakerの一人です。
彼らは、最小限のメンテナンスとアップグレードで何年も持続し、すべてのコンポーネントの完全なカスタマイズを提供するリグを構築したいと考えていました。
そのため、Xer0は完全なATXサーバーを設計して構築しました。これは従来のデスクトップPCに似ていますが、Ethereumでのstakingに特化しています。
彼らのセットアップには、6コアのXeon Bronze 3204(1.9 GHz)、8つのDDR4スロット、M.2スロットが含まれています。ただし、これは基本的にホームサーバービルドであるため、正確なコンポーネントは完全にエンドユーザー次第です。

Xer0のセットアップ:

- Motherboard: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Cooler: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **合計: $1680**

Xer0がこのセットアップを選んだ理由についてのコメント:

_明らかに、単にEthereumネットワークでstakingするために怪物を構築する必要はありませんが、私がこのようなものを構築したいくつかの理由があります。_

1. _現在、将来1つ以上のvalidatorは、現在見ているよりもはるかに価値があると信じているので、少なくとも次の10〜20年間、問題なくネットワークをサポートできるものを購入したかったのです。_
1. _これだけのコア数を持つマシンを作成することで、ハードウェアに関する問題なくL2アグリゲーターをこの上で実行できるほどの余裕ができました。また、サーバーで実行したい他のものも実行できます。_ :)
1. _私はコンピューターを組み立てるのが好きなので、組み立てました…_
1. _サーバービルドでは、ほとんどのコンピューターにネイティブにない多くのハードウェアと機能の柔軟性が得られます。_
1. _ちょっとした将来性(万が一のため)_ :wink:

### Darciusのシェルフリグ

![](./images/Darcius.jpg)

Rocket Poolの創設者David Rugendyke(Discordでは**darcius**として知られています)は、nodeを完璧にするために長い時間を費やしました。
議論の末、彼は小型でポータブルでありながら、膨大な処理能力を備えたMini-ITXを構築しました。
彼のリグには、8コアのRyzen 7 5800x(3.8 GHz)、2つのDDR4スロット、NVMe SSD用の2つのM.2スロットが含まれています。
これは真にRocket Pool nodeの中で最も高性能なリグの1つですが、それには十分な理由があります。darciusはOracle Nodeと呼ばれる特別なタイプのRocket Pool nodeを実行しており、これはBeacon chainからExecution chainへ、すべてのRocket Pool validatorに関する情報を中継します。
数千のRocket Pool minipoolが監視対象としてアクティブであるため、そのジョブには多くの馬力が必要です。しかし、彼のシェルフリグは簡単にそのタスクに対応できます。

Darciusのセットアップ:

- Motherboard: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **合計: $1587**

### YorickのmicroATXビルド

![](./images/Yorick-stock.jpg)

ベテランのハードウェア愛好家**YorickDowne**は、サーバーの構築と保守に関する豊富な経験を持っています。
その知識を使用して、彼は柔軟なmicroATXセットアップに落ち着きました。
彼のマシンは一般的なPCよりもかなり小さいですが、Rocket Pool nodeを実行する際に重要なメトリックである回復力と稼働時間を最大化するサーバーグレードのテクノロジーを収めることができます。
彼はIntelとAMDの両方のセットアップに関する推奨事項を持っており、[彼のウェブサイト](https://eth-docker.net/docs/Usage/Hardware)で確認できます。
Intelバージョンは、4コアi3-9100F(3.6 GHz)またはXeon CPUを使用し、AMDバージョンはECCメモリをサポートする任意のRyzen CPUを提案しています。
両方の構成について、彼は16GBのECC RAMと1TBのNVMe SSDを提案しています。

Yorickのセットアップ:

- Motherboard: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: 任意(例: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Case fans: 任意
- **合計: 約$886**

Yorickがこのセットアップを選んだ理由についてのコメント:

- _一部のNUCと同じかそれ以下のコストです_
- _ECC RAMがあります。つまり、メモリが故障した場合(時々起こります)、システムが教えてくれるので、わかります。問題が不安定性に関連しているかどうかを把握するために、memtest87を4〜5日間実行する必要はありません。私は自分の時間を大切にしているので、Discordで饒舌に話すことができ、ハードウェアのトラブルシューティングに時間を費やす必要がありません_
- _IPMIがあります。これは、UEFIと電源サイクルを含む、Ethernet/ブラウザ経由のマシン全体のリモート管理です。長期休暇に行けるようにしたいので、完全なリモートアクセスが必要です。_
- _冗長ストレージが必要な場合、最終的なSSD故障は問題になりません。それを行うことができます_
- _ビルドの選択に大きな柔軟性があります。必要なRAMと計算をどれだけでも選択できます。TrueNAS Scaleのような仮想化技術を使用してNASを実行し、その上にnodeを実行して、他のホームサーバー的なものと一緒に実行できます。_

### Drezのラップトップ

![](./images/Drez.jpg)

時には、新しいハードウェアにお金を使うことは意味をなさないことがあります。
Discordユーザー**Drez**の場合、Rocket Pool nodeを実行することはそのような時の1つです。
Drezは偶然予備のラップトップを持っており、それを簡単にnodeに変えました。
彼らのマシンには、4コアi7-4710HQ(2.5 GHz)、2つのDDR3スロット、2.5" SATAスロットが付属しています。
ラップトップであるため、独自のバッテリーも付属しています(UPSの必要性を相殺します)。
彼らは時間をかけていくつかの追加のアップグレードを追加し、ラップトップにさらなる安心感を与えました。

Drezのセットアップ:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz(付属)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **合計: $1910**

Drezがこのセットアップを選んだ理由についてのコメント:

_このラップトップでstakingする主な理由は、すでに予備を持っていて、新しいサーバーに余分なお金を使う必要がないからです。
可動性、コンパクトさ、簡単な監視のための内蔵画面が気に入っています。
過熱の場合、ラップトップ冷却パッドと予備のCPUクーラーを購入しました。また、特に古いマシンで実行する場合は、サーマルコンパウンドペーストを交換することをお勧めします_

## NUC(Next Unit of Computing)とMini-PC

Rocket Pool nodeの実行には、必ずしも完全な自作デスクトップが必要なわけではありません。
実際、stakerの間で最も人気のあるセットアップの1つは、著名なNUCです。
NUC(Next Unit of Computing)は基本的に、非常に低い消費電力と最大の効率を中心に設計された小型の自己完結型コンピューターです。
NUCは、低メンテナンス、低い月間ランニングコスト、セットアップの容易さのため、数個のvalidatorのみを実行するほとんどのstakerにとって優れています。
PCとは異なり、NUCはケース内に事前に組み立てられています。必要なのは、RAMを追加し、SSDを追加するだけで、準備が整います。
以下は、Rocket Poolのベテランが使用し、推奨するNUCセットアップのいくつかの例です。

::: tip NOTE
**Ethernet Adaptor互換性**

Intel® NUC 11世代または12世代の購入を計画している場合、Ethernetアダプターとの接続の問題が発生する可能性があります。特に、アダプターが**I225-LM**として識別される場合です(購入前にIntelの仕様を確認してください)。
既に持っている場合は、この懸念に対処するための手順があります。
I225-LMアダプターは、特にLinuxカーネルを使用する場合に、**システムフリーズ**や予期しないカーネル動作につながる可能性のある、特定の互換性の課題に関連付けられています。

NUCが問題のあるI225-LM Ethernetアダプターを使用しているかどうかを判断するには、ターミナルで次のコマンドを使用できます。

```shell
sudo lshw -class network | grep 225
```

出力がI225-LMアダプターの存在を確認した場合、上記の問題が発生する可能性があります。ただし、これらの問題を軽減するために適用できる_救済策_があります。

**USB-C to Ethernet Adaptor**: 実行可能なソリューションには、USB-C to Ethernetアダプターを取得し、この外部アダプターを介してインターネットケーブルを接続することが含まれます。このアプローチには追加のハードウェアと構成が必要ですが、互換性の競合を解決するのに効果的であることが証明されています。これにより、I225-LMアダプターに関連するフリーズやカーネル関連の異常に遭遇することなく、最新の利用可能なLinuxカーネルを利用できます。**これは、I225-LMを搭載したNUCを既に持っている場合の推奨ソリューションです(現時点では)** _アダプターを選択すると、潜在的な遅延やインターネット速度の低下というトレードオフが生じる可能性があることに注意してください。この影響を軽減するために、少なくとも1GB/sの移植性を持つアダプターを選択することをお勧めします。これにより、最適なデータ転送速度の維持に役立ちます。_

**Driver and Software Updates**: NUCモデルの公式Intel®サポートページ[こちら](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads)を参照して、ドライバー、ファームウェア、BIOSを更新することを検討してください。これには、Intelのウェブサイトから最新の利用可能なサポートドライバーを使用すること、または互換性の懸念に対処するBIOS更新を適用することが含まれる場合があります。

**Intel's Patch (Windows)**: Intelは、Windowsシステムで同様の問題に対処するためのパッチをリリースしました。パッチ自体**はLinux環境に直接適用されない可能性があります**が、Intelによる問題の認識と解決策を提供するための取り組みを強調しています。パッチの詳細については、この[リンク](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3)で確認できます。

テクノロジーは進化しており、ソリューションは時間とともに変化する可能性があることに留意してください。特定のNUCモデルの公式ダウンロード[ページ](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads])でIntelが提供する最新のリソースを常に最新の状態に保ってください。

これらの手順に従うことで、Intel® NUC 11世代および12世代製品のI225-LM Ethernetアダプターに関連する互換性の課題に対処し、サーバー展開でよりスムーズで信頼性の高いエクスペリエンスを保証できます。 _このアダプターを使用しているNUCユーザーのサブセットは問題を経験していないと報告していますが、**大多数のユーザー**、特にカーネルのアップグレード後に問題が発生していることに注意することが重要です。特に、5.15.+カーネルは、I225-LMアダプターを使用しているユーザーにとって最も安定したオプションであることが証明されています。USB-Cアダプターを使用するというアイデアが魅力的でなく、ランダムなフリーズのリスクを負う覚悟がある場合は、**より大きな安定性を示したカーネルバージョンに留まることをお勧めします**。_
:::

### KenのNUC8i5BEK

![](./images/Ken.jpg)

NUC8i5BEKは、第8世代プロセッサを搭載したIntel独自のNUCの1つです。
2018年にリリースされたこのモデルには、4コアi5-8259U CPU(2.30 GHz)、2つのDDR4スロット、SSD用のM.2スロット、USB 3.1ポートが付属しています。
通常は約20ワットを消費しますが、Discordユーザー**Ken**は通常のvalidation中に9ワットまで最適化することができました。
任意のExecutionクライアントと任意のConsensusクライアントを処理できるため、軽量で効率的なnodeマシンとして優れた選択肢です。

Kenのセットアップ:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Fanless Case(オプション): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **合計: $691〜$825**

Kenがこのセットアップを選んだ理由についてのコメント:

- _小型でフットプリントが小さく、電源は電源コード上のブリックです(ラップトップのように)。シングルボードコンピューター、x86アーキテクチャ、低価格、低消費電力(〜10W)、3年保証、アクティブな製品ライン(Intel)です。_
- _第8世代は十分に高速で、最新世代のチップよりも低価格です。_
- _ファンレス(パッシブ冷却)ケースにアップグレードしたので、NUCは完全に静かです(0 dB)。私のホームオフィスに置いているためです(ストックのNUCはすでにほぼ静かです)。_
- _さらに、ファンベアリングの機械的摩耗がありません。_
- _このハードウェアプラットフォームをRocket Pool nodeとして引退させることにした場合の再販または再利用価値 - NUCは優れたワークステーションコンピューターになります。_

### GreyWizardのNUC10i7FNH

![](./images/GreyWizard.jpg)

NUC10i7FNHは、Intelの独自のNUCの別の1つです。
これは第10世代プロセッサを搭載しており、2019年にリリースされました。
6コアi7-10710U CPU(1.10 GHz、4.7 GHzまでブースト)、2つのDDR4スロット、M.2スロットと2.5"スロットのSSD、USB 3.1ポートが付属しています。
約20ワットの電力を消費します。
消費電力とサイズを考えると、非常に強力なマシンです。
Discordユーザー**GreyWizard**は、このNUCを自分のnodeに使用しています。追加の電力は、Ethereum 2.0チェーンの将来が何をもたらしても、マシンがそれを処理できることを知っているという安心感を彼に与えます。

GreyWizardのセットアップ:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 ea.)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **合計: $1068**

GreyWizardがこのセットアップを選んだ理由についてのコメント:

_私がi7 NUCを選んだ主な理由は、全体的なサイズとオーバーヘッドに対する優れたパフォーマンスの最良の組み合わせのように感じたためです。
Micro ATXサイズのマシンを構築するなどの他のオプションも検討しました。
探していた仕様で価格を設定した後、このIntel NUCは大体同じ価格になり、フォームファクターは本当に打ち負かすのが難しいです。
パフォーマンス/安心感のために余分な余裕があるのが好きで、これはほぼ確実に過剰であることを認めます。
私はstakingを真剣な投資と見なしており、ハードウェアが十分であるかどうかを心配したくありません。_

_これをオプションとして検討している他の人へのヒント..._

- _NUCはかなり暖かく動作し、ラップトップと同様の温度です。CPU温度を心配し、強力なものが必要な場合は、Micro ATXのような小型デスクトップセットアップを検討する必要があります。_
- _NUCの周りに空気の流れのための十分なスペースがあることを確認する必要があります。埃の蓄積を防ぐために、定期的にエリアを清掃することを計画してください。_
- _RAMカードの互換性を確認してください。異なるNUCは、合計RAM、RAM速度などのさまざまな程度をサポートしています。_
- _NUCを使用する場合、RAMを選択する際に成長の余地を与えることをお勧めします。たとえば、少し余分に費やして、2x16ではなく単一の32gb RAMカードを入手してください。そうすれば、後で拡張できます(この例でNUCが64gbをサポートすると仮定)_
- _議論したい場合は、Discordで私に連絡してください。_

### ArtDemocratのNUC10i5FNHNビルドプロセスビデオ

Greywizardのセットアップの説明とヒントを補完するために、ArtDemocratはNUC10をセットアップするための追加のヘルプリソースとしてこのビルドプロセスビデオを作成しました(この場合はNUC10i5FNHNですが、ビルドプロセスはNUC10i7FNHと同様であるはずです):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocratのセットアップ:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17のPN50

![](./images/PN50-actioncj17.jpg)

ASUS PN50はmini-PCであり、IntelのNUCファミリーと多くの共通点があります。
非常に小さなフォームファクターですが、完全なPCのすべてのコンポーネントと機能を備えています。
選択したAMD CPUが付属しているため、パフォーマンスとコストのバランスを取ることができます(最大8コアのRyzen R7-4700U、2.0 GHz)。2つのDDR4スロット、M.2スロットと2.5"スロットのSSD、USB 3.1ポートが付属しています。
また、90ワットの電源が付属していますが、実際にはRocket Pool nodeとして動作しているときにそれほど多くの電力を必要としません。
Discordユーザー**actioncj17**はいくつかの異なるセットアップを試しましたが、PN50をすべてに優先します。ただし、Rocket Pool nodeを実行するには過剰であることを喜んで認めます。

Actioncj17のセットアップ:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **合計: $1118**

Actioncj17がこのセットアップを選んだ理由についてのコメント:

_私がAsus PN50を選んだ理由の答えは非常に簡単です。
AMDのRyzen 7 4700Uがどれほど優れているかを見たかったのです。
がっかりしたとは言えません。
実際、Intel NUC10FNKから始めました。
nucに32gbのramと1tb 970 evo plus nvme m.2を入れましたが、燃えるように動作します。
nucに不満はなく、問題なく動作しますが、PN50からはより多くを得られます。
両方のセットアップはRocketpoolでのstakingには過剰だと思いますが、少しの将来性は害にはなりません。
どちらも小さなフットプリントを持ち、nucはファンレスであるため、実際にははるかに静かです。
全体として、PN50は手に入れることができれば、コストパフォーマンスが優れています。_

### MoralcompassのMini-PC

![](./images/moralcompass-minipc.jpg)

Discordユーザー**moralcompass**は、actioncj17と同様のルートを選択してmini-PCを選択しましたが、彼らの好みはIntel CPUです。
彼らは、4コアi5 8250U(1.6 GHz、最大3.4 GHzまでブースト)、1つのDDR4スロット、M.2スロットと2.5"スロットのSSD、USB 3.0ポートを搭載したmini PCを使用しています。
Moralcompassは、壁から約10ワットしか引き出さないと主張しており、このようなmini PCが非常に効率的であることを示しています。
この選択の興味深い点は、完全にパッシブ冷却されていることです。ファンはありません。
ファンレスのmini PCには多くのバリエーションがありますが、moralcompassは自分に合ったものを見つけ、それを使い続けています。

Moralcompassのセットアップ:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **合計: $655**

Moralcompassがこのセットアップを選んだ理由についてのコメント:

- _可動部品がなく、ノイズがありません。_
- _デュアルIntel NIC(いつかこれをルーターとして再利用することにした場合に備えて)_
- _NVME + SATAスロット(速度とより高いTBW耐久性のオプションのためにNVMEを好みます。SATAはHDDまたはSSDのオプションを提供します。これらのSSDはレガシーに変わりつつあるように見えるため、M.SATAインターフェースは避けました)_
- _UPSからの優雅なシャットダウン信号のためにUSBおよびシリアルポートが利用可能_
