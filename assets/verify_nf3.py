"""NF3 control calculation, generated with AI assistance; Python standard library only.

Numbering: N1, F2, F3, F4.  ab means a after b.
This check is supplementary and does not replace the required handwritten work.
"""
from itertools import product
from math import cos, sin, sqrt, pi, radians, acos, degrees
import json

NAMES = ['E', 'r', 'r2', 'sigma1', 'sigma2', 'sigma3']
PERMS = [(1,2,3,4),(1,3,4,2),(1,4,2,3),(1,2,4,3),(1,4,3,2),(1,3,2,4)]
def compose(p,q): return tuple(p[q[i]-1] for i in range(4))
def inverse(p): return tuple(p.index(i)+1 for i in range(1,5))
def mm(a,b): return [[sum(a[i][k]*b[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
def mv(a,v): return [sum(a[i][k]*v[k] for k in range(3)) for i in range(3)]
def close(a,b): return all(abs(x-y)<1e-10 for x,y in zip(a,b))
def rot(a): return [[cos(a),-sin(a),0],[sin(a),cos(a),0],[0,0,1]]
def refl(a): return [[cos(2*a),sin(2*a),0],[sin(2*a),-cos(2*a),0],[0,0,1]]

table=[[PERMS.index(compose(p,q)) for q in PERMS] for p in PERMS]
for a,b,c in product(PERMS,repeat=3): assert compose(compose(a,b),c)==compose(a,compose(b,c))
orders=[]
for p in PERMS:
    x=PERMS[0]
    for k in range(1,7):
        x=compose(x,p)
        if x==PERMS[0]:orders.append(k);break
subgroups=[]
for mask in range(1,64):
    H={i for i in range(6) if mask&(1<<i)}
    if 0 in H and all(table[i][j] in H for i,j in product(H,repeat=2)):
        subgroups.append(sorted(H))
classes=[]
for p in PERMS:
    C=sorted({PERMS.index(compose(compose(g,p),inverse(g))) for g in PERMS})
    if C not in classes:classes.append(C)
assert len(subgroups)==6 and [len(c) for c in classes]==[1,2,3]

d=1.365;angle=102.37;alpha=radians(angle)
R=d*sqrt(2*(1-cos(alpha))/3);h=d*sqrt((1+2*cos(alpha))/3)
coords=[[0,0,h],[R,0,0],[-R/2,sqrt(3)*R/2,0],[-R/2,-sqrt(3)*R/2,0]]
matrices=[rot(0),rot(2*pi/3),rot(4*pi/3),refl(0),refl(2*pi/3),refl(4*pi/3)]
for M,p in zip(matrices,PERMS):
    for i,v in enumerate(coords):assert close(mv(M,v),coords[p[i]-1])
for i,j in product(range(6),repeat=2):
    for a,b in zip(mm(matrices[i],matrices[j]),matrices[table[i][j]]):assert close(a,b)
vectors=[[coords[i][k]-coords[0][k] for k in range(3)] for i in (1,2,3)]
lengths=[sqrt(sum(x*x for x in v)) for v in vectors]
angles=[degrees(acos(sum(a*b for a,b in zip(vectors[i],vectors[j]))/d**2)) for i,j in ((0,1),(0,2),(1,2))]
assert all(abs(v-d)<1e-10 for v in lengths)
assert all(abs(v-angle)<1e-10 for v in angles)

result={'result':'PASS','closure_products_checked':36,'associativity_triples_checked':216,'matrix_products_checked':36,'subgroups_count':len(subgroups),'conjugacy_classes_count':len(classes),'orders':orders,'table':[[NAMES[x] for x in row] for row in table],'subgroups':[[NAMES[x] for x in H] for H in subgroups],'classes':[[NAMES[x] for x in C] for C in classes],'bond_lengths_angstrom':lengths,'bond_angles_degrees':angles}
print(json.dumps(result,ensure_ascii=False,indent=2))
