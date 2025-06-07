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
debug(
    option={
        "e": {"reshape": 1},
        "array3": {"reshape": 1},
        "ndarray3": {"reshape": 1},
        "ndarray4": {"reshape": 2},
        "stk3": {"reshape": 1}    
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
    stk3 = stk3
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
debug(
    option={
        "e": {"reshape": 1},
        "array3": {"reshape": 1},
        "ndarray3": {"reshape": 1},
        "ndarray4": {"reshape": 2},
        "stk3": {"reshape": 1}    
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
    stk3 = stk3
)