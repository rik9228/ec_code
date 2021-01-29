"use strict";

(() => {
  const $resetButton = document.querySelector(".nav-bottom__link--reset");
  const $confirm = document.querySelectorAll(".confirm");
  const $buyButton = document.querySelectorAll(".shop__button");
  const $delButton = document.querySelectorAll(".shop__button--delete");
  const $select = document.querySelector(".shop__select");
  const $bottomPrice = document.querySelector(".nav-bottom__sum");
  const $bottomQuant = document.querySelector(".nav-bottom__quantity");
  const ITEMS = JSON.parse(localStorage.getItem("items")); //ローカルストレージの商品データ配列

  let sumPrice = 0;
  let sumQuant = 0;
  const items = [];
  let saveItems = [];
  let clicked = [];

  // ローカルストレージの有無確認
  if (ITEMS !== null) {
    // ローカルストレージにデータが入っている場合
    $buyButton.forEach((elem, index) => {
      for (let i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].id === index) {
          elem.classList.add("js-active");
          sumPrice = sumPrice + Number(elem.dataset.price);
          $bottomPrice.textContent = `¥${sumPrice}`;
        }
      }
    });

    // 購入点数の表示
    sumQuant = ITEMS.length;
    $bottomQuant.textContent = `${ITEMS.length}点`;

    for (let i = 0; i < ITEMS.length; i++) {
      saveItems.push(ITEMS[i]);
    }
  }

  for (let i = 0; i < $buyButton.length; i++) {
    // カテゴリーを配列のなかに格納する
    items.push($buyButton[i]);

    // 購入ボタンを押したとき
    $buyButton[i].addEventListener("click", (e) => {
      e.preventDefault();
      const tItem = e.target;
      const tItemIndex = Number(e.target.dataset.num);
      const tItemPrice = Number(e.target.dataset.price);
      const tItemName = e.target.dataset.name;

      clicked.push(tItemIndex);

      //データ保存用の配列に商品データを追加
      saveItems.push({
        id: tItemIndex,
        name: tItemName,
        price: tItemPrice,
      });

      sumQuant++;
      sumPrice = sumPrice + tItemPrice;
      $bottomPrice.textContent = `¥${sumPrice}`;
      $bottomQuant.textContent = `${sumQuant}点`;

      // クラス付与の処理
      if (tItem.classList.contains("js-active")) {
      } else {
        tItem.classList.add("js-active");
      }
    });

    // セレクトボックスの値を変えたとき
    $select.addEventListener("change", () => {
      const sValue = $select.value;
      if (sValue !== items[i].dataset.category) {
        // 選択値と一致しない商品にアクティブクラスを付与する
        items[i].parentNode.classList.add("js-hidden");
      } else {
        items[i].parentNode.classList.remove("js-hidden");
      }

      // 全ての商品を表示
      if (sValue === "all") {
        items[i].parentNode.classList.remove("js-hidden");
      }
    });
  }

  for (let i = 0; i < $delButton.length; i++) {
    $delButton[i].addEventListener("click", (e) => {
      const $prevButton = $delButton[i].previousElementSibling;
      const eNum = Number(e.target.previousElementSibling.dataset.num);
      const eName = e.target.previousElementSibling.dataset.name;
      const ePrice = Number(e.target.previousElementSibling.dataset.price);

      //クリック管理用の配列から対象のボタンのindexを削除
      for (let i = 0; i < clicked.length; i++) {
        if (clicked[i] === eNum) {
          clicked.splice(i, 1);
          // //データ保管ようの配列から対象の商品データを削除
          saveItems.splice(i, 1);
        }
      }

      console.log(saveItems);

      // クラスの取り消し
      $prevButton.classList.remove("js-active");

      // 値段が0円のとき、合計金額を0円にして以降処理を行わない
      if (sumPrice === 0) {
        sumPrice = 0;
        return;
      }

      sumQuant--;
      sumPrice = sumPrice - ePrice;
      $bottomQuant.textContent = `${sumQuant}点`;
      $bottomPrice.textContent = `¥${sumPrice}`;

      localStorage.setItem("items", JSON.stringify(saveItems));
    });
  }

  // リセットボタンの処理
  $resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("js-active");
    }
    sumPrice = 0;
    sumQuant = 0;
    $bottomPrice.textContent = `¥${sumPrice}`;
    $bottomQuant.textContent = `${sumQuant}点`;
    saveItems.length = 0;
    localStorage.clear(); //全データを消去

    $buyButton.forEach((elem) => {
      elem.disabled = false;
    });
  });

  // 購入ボタンを押したとき
  for (let i = 0; i < $confirm.length; i++) {
    $confirm[i].addEventListener("click", (e) => {
      if (localStorage !== null) {
        localStorage.setItem("items", JSON.stringify(saveItems));
      } else {
        e.preventDefault();
        alert("カートに商品がありません");
      }
    });
  }
})();
