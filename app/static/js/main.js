import renderVariablesTable from "./printVariables.js";
import renderOneDArrayTable from "./printOneDArray.js";
import printNDArray from "./printNDArray.js";
import printSegmentTree from "./printSegmentTree.js";
import renderStackTable from "./printStack.js";
import renderQueueTable from "./printQueue.js";
import renderDictTable from "./printDict.js";
import renderSetTable from "./printSet.js";

//すべての表示を更新する
function renderTable(start_step,last_step,all_variables){
    //変数のテーブル
    renderVariablesTable(start_step,last_step,all_variables);
    //一次元配列のテーブル
    renderOneDArrayTable(start_step,last_step,all_variables);
    //N次元配列のテーブル
    _printNDArray.renderNDArray(start_step,last_step,all_variables);
    //セグ木のテーブル
    _printSegmentTree.renderSegmentTreeTable(start_step,last_step,all_variables);
    //スタックのテーブル
    renderStackTable(start_step,last_step,all_variables);
    //キューのテーブル
    renderQueueTable(start_step,last_step,all_variables);
    //辞書のテーブル
    renderDictTable(start_step,last_step,all_variables);
    //集合のテーブル
    renderSetTable(start_step,last_step,all_variables);
}

//1つの変数しか表示しないテーブルは同時に表示するステップを変えても表示する変数を変えたくないので、
//renderTableとは別に選択をリセットできるようにする
function selectAllReset(start_step,last_step,all_variables){
    //N次元配列のセレクトのリセット
    _printNDArray.selectAllSet(start_step,last_step,all_variables);
    //セグ木のセレクトのリセット
    _printSegmentTree.selectAllSet(start_step,last_step,all_variables);
}

//_current_stepが変わったら行う関数
function changeCurrentStep(start_step,last_step,all_variables){
    const step_select = document.getElementById('step-select');
    step_select.value = start_step;
    selectAllReset(start_step,last_step,all_variables);
    renderTable(start_step,last_step,all_variables);
}

//_display_step_countが変わったら行う関数
function changeDisplayStepCount(start_step,last_step,all_variables){
    renderTable(start_step,last_step,all_variables);
}


//ステップ戻るボタンに機能の追加
//_current_stepを減らし、更新
document.getElementById("prev-btn").addEventListener("click", () => {
    if (_current_step > 0) {
        _current_step--;
        changeCurrentStep(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
    }
});

//ステップ戻るボタンに機能の追加
//_current_stepを減らし、更新
document.getElementById("next-btn").addEventListener("click", () =>{
    if (_current_step < _all_variables.length - 1) {
        _current_step++;
        changeCurrentStep(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
    }
});

//どのステップを選択するかボタンに機能の追加
//_current_stepを直接変更
const _step_select = document.getElementById('step-select');
_step_select.addEventListener('change', (event) => {
    // 選ばれたoptionのvalueを数値に変換して代入
    _current_step = Number(event.target.value);
    changeCurrentStep(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
});

//ステップを同時に表示する量を決定するボタンに機能の追加
//_display_step_countを変えて、同時に表示するステップを変更
const _step_length_select = document.getElementById('step-length-select');
_step_length_select.addEventListener('change', (event) => {
    // 選ばれたoptionのvalueを数値に変換して代入
    _display_step_count = Number(event.target.value);
    changeDisplayStepCount(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
});

//表示するステップ
let _current_step = 0;
//同時に表示するステップの数
let _display_step_count = 1;
//すべての変数が入っているjson
const _all_variables = window._all_variables;
//N次元配列のテーブルを表示するためのクラス
const _printNDArray = new printNDArray(
    () => Math.max(0, _current_step),
    () => Math.min(_current_step + _display_step_count, _all_variables.length),
    () => _all_variables
);
//セグ木のテーブルを表示するためのクラス
const _printSegmentTree = new printSegmentTree(
    () => Math.max(0, _current_step),
    () => Math.min(_current_step + _display_step_count, _all_variables.length),
    () => _all_variables
);

//初期表示
selectAllReset(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
renderTable(Math.max(0,_current_step),Math.min(_current_step+_display_step_count,_all_variables.length),_all_variables);
