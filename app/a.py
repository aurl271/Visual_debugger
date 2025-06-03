from atcoder.segtree import SegTree

# 区間和を管理するセグメント木を作成
a = [1, 2, 3, 4, 5]
st = SegTree(lambda x, y: x + y, 0, a)

# 区間[1, 4)の和を出力（2+3+4=9）
print(st.prod(1, 4))

# 2番目の値を10に変更
st.set(2, 10)

# 全体の和を出力（1+2+10+4+5=22）
print(st.all_prod())

# 3番目の値を取得
print(st.get(3))

print(st.get_segtree())