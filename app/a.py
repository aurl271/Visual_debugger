import ast
a = {"a": 1, "b": 2, "c": 3}
print(a)
print(isinstance(a, (dict,)))
b = ast.literal_eval(str(a))
print(b)
print(isinstance(b, (dict,)))
c = (1,2)
print(isinstance(c, (tuple,)))
"""
from atcoder.segtree import SegTree
from collections import deque

def __get_dimension(array):
    if not isinstance(array, list):
        return 0
    if not array:
        # 空リストは0次元とみなす
        return 0
    return 1 + __get_dimension(array[0])
    
def __reshape_array(array,m):
    if __get_dimension(array) == m:
        return str(array)
    else:
        return [__reshape_array(x,m) for x in array]

#option={変数名:{reshape: int}}
#reshapeでmを指定すると、m次元配列を1つの要素として扱う
def debug(option = {},**kwargs):
    print("###debug_start")
    for name,value in kwargs.items():
        if name in option:
            for key, val in option[name].items():
                if key == "reshape" and isinstance(value, (list,)):
                    value = __reshape_array(value, val)
                elif key == "reshape" and isinstance(value, (deque,)):
                    value = deque([str(x) for x in value])
                    
        if isinstance(value, (int, str, float)):
            print(f"variables {name} {value}")
        elif isinstance(value, (deque,)):
            print(f"deque {name} {list(value)}")
        elif isinstance(value, (list,)):
            if "stack" in name.lower() or "stk" in name.lower():
                print(f"stack {name} {value}")
            elif __get_dimension(value) == 1:
                print(f"one_d_array {name} {value}")
            elif __get_dimension(value) > 1:
                print(f"n_d_array {name} {value}")
        elif isinstance(value, (SegTree,)):
            print(f"segtree {name} {value.get_segtree()}")

    print("###debug_end")


a = 1
b = "a"
c = 3.14
d = (1,2)
e = [3,4]
array1 = [1, 2, 3]
array2 = [(1,2), (3,4)]
array3 = [[1,2],[3,4]]
ndarray1 = [[[1,2],[3,4]],[[5,6],[7,8]]]
ndarray2 = [[[(1,-1),(2,-2)],[(3,-3),(4,-4)]],[[(5,-5),(6,-6)],[(7,-7),(8,-8)]]]
ndarray3 = [[[1,2],[3,4]],[[5,6],[7,8]]]
ndarray4 = [[[1,2],[3,4]],[[5,6],[7,8]]]

from atcoder.segtree import SegTree
seg1 = SegTree(lambda x, y: x + y, 0, [1,2,3,4,5])
seg2 = SegTree(lambda x, y: max(x,y), 0, [1,2,3,4,5])

stk1 = [1, 2, 3]
stk2 = [(1,2), (3,4), (5,6)]
stk3 = [[1,2], [3,4], [5,6]]

from collections import deque
queue1 = deque([1, 2, 3])
queue2 = deque([(1, 2), (3, 4), (5, 6)])
queue3 = deque([[1, 2], [3, 4], [5, 6]])
print(isinstance(queue3, (deque,)))
debug(
    option={
        "e": {"reshape": 1},
        "array3": {"reshape": 1},
        "ndarray3": {"reshape": 1},
        "ndarray4": {"reshape": 2},
        "stk3": {"reshape": 1},
        "queue3": {"reshape": 1}
    },
    a = a,
    b = b,
    c = c,
    d = d,
    e = e,
    array1 = array1,
    array2 = array2,
    array3 = array3,
    ndarray1 = ndarray1,
    ndarray2 = ndarray2,
    ndarray3 = ndarray3,
    ndarray4 = ndarray4,
    seg1 = seg1,
    seg2 = seg2,
    stk1 = stk1,
    stk2 = stk2,
    stk3 = stk3,
    queue1 = queue1,
    queue2 = queue2,
    queue3 = queue3
)

a += 3
b += "b"
c *= 2
d = (d[0] + 1, d[1] + 2)
e = [x + 1 for x in e]
array1 = [x + 1 for x in array1]
array2 = [(x[0] + 1, x[1] + 2) for x in array2]
array3 = [[x[0] + 1, x[1] + 2] for x in array3]
ndarray1 = [[[x[0] + 1, x[1] + 2] for x in sublist] for sublist in ndarray1]
ndarray2 = [[[(x[0] + 1, x[1] + 2) for x in sublist] for sublist in subsublist] for subsublist in ndarray2]
ndarray3 = [[[x[0] + 1, x[1] + 2] for x in sublist] for sublist in ndarray3]
ndarray4 = [[[x[0] + 1, x[1] + 2] for x in sublist] for sublist in ndarray4]
seg1.set(0, 10)
seg2.set(0, 10)
stk1.append(4)
stk2.append((7,8))
stk3.append([7,8])
queue1.append(4)
queue2.popleft()
queue3.append([7,8])
debug(
    option={
        "e": {"reshape": 1},
        "array3": {"reshape": 1},
        "ndarray3": {"reshape": 1},
        "ndarray4": {"reshape": 2},
        "stk3": {"reshape": 1},
        "queue3": {"reshape": 1}
    },
    a = a,
    b = b,
    c = c,
    d = d,
    e = e,
    array1 = array1,
    array2 = array2,
    array3 = array3,
    ndarray1 = ndarray1,
    ndarray2 = ndarray2,
    ndarray3 = ndarray3,
    ndarray4 = ndarray4,
    seg1 = seg1,
    seg2 = seg2,
    stk1 = stk1,
    stk2 = stk2,
    stk3 = stk3,
    queue1 = queue1,
    queue2 = queue2,
    queue3 = queue3
)
"""