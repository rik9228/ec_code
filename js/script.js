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
          clicked.push(ITEMS[i].id);
          saveItems.push(ITEMS[i]);
          $buyButton[index].classList.add("js-active");
          $buyButton[index].disabled = true;
          sumPrice = sumPrice + Number(elem.dataset.price);
          $bottomPrice.textContent = `¥${sumPrice}`;
        }
      }
    });
    // 購入点数の表示
    sumQuant = ITEMS.length;
    $bottomQuant.textContent = `${ITEMS.length}点`;
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

      //データ保存用の配列に商品データを追加
      saveItems.push({
        id: tItemIndex,
        name: tItemName,
        price: tItemPrice,
      });

      clicked.push(tItemIndex);

      $buyButton[i].disabled = true;
      $buyButton[i].classList.add("js-active");

      sumQuant++;
      sumPrice = sumPrice + tItemPrice;
      $bottomPrice.textContent = `¥${sumPrice}`;
      $bottomQuant.textContent = `${sumQuant}点`;

      localStorage.setItem("items", JSON.stringify(saveItems));
    });
  }

  for (let i = 0; i < $delButton.length; i++) {
    $delButton[i].addEventListener("click", (e) => {
      const $prevButton = $delButton[i].previousElementSibling;
      const eNum = Number(e.target.previousElementSibling.dataset.num);
      const ePrice = Number(e.target.previousElementSibling.dataset.price);

      deleteCount(ePrice);

      if ($prevButton.disabled) {
        $prevButton.disabled = false;
        $prevButton.classList.remove("js-active");
      }

      // //クリック管理用の配列から対象のボタンのindexを削除
      for (let i = 0; i < clicked.length; i++) {
        if (clicked[i] === eNum) {
          // 対象の要素のi番がspliceの第１引数として使用される。
          // 例：[1,2]
          // 1(clicked[i]) === 1(eNum)
          // i → 0;
          // clicked.splice(0,1);
          // savaItems.splice(0,1);

          clicked.splice(i, 1);
          saveItems.splice(i, 1);
        }
      }
      localStorage.setItem("items", JSON.stringify(saveItems));
    });
  }

  // セレクトボックスの値を変えたとき
  $select.addEventListener("change", (e) => {
    sortItem(e);
  });

  // リセットボタンの処理
  $resetButton.addEventListener("click", (e) => {
    resetItem(e);
  });

  // 購入ボタンを押したとき
  for (let i = 0; i < $confirm.length; i++) {
    $confirm[i].addEventListener("click", (e) => {
      if (saveItems.length === 0) {
        e.preventDefault();
        alert("カートに商品がありません");
      } else {
      }
    });
  }

  // 購入点数を減少する関数
  const deleteCount = (price) => {
    sumQuant--;
    sumPrice = sumPrice - price;
    if (sumPrice < 0) {
      sumPrice = 0;
      return;
    }
    $bottomQuant.textContent = `${sumQuant}点`;
    $bottomPrice.textContent = `¥${sumPrice}`;
  };

  // アイテムの並べ替え
  const sortItem = (value) => {
    for (let i = 0; i < $buyButton.length; i++) {
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
    }
  };

  // アイテムをリセットさせる関数
  const resetItem = (e) => {
    e.preventDefault();
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("js-active");
    }
    sumPrice = 0;
    sumQuant = 0;
    $bottomPrice.textContent = `¥${sumPrice}`;
    $bottomQuant.textContent = `${sumQuant}点`;
    saveItems.length = 0;
    localStorage.clear();

    $buyButton.forEach((elem) => {
      elem.disabled = false;
    });
  };
})();
