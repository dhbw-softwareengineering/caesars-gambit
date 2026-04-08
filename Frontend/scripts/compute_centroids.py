#!/usr/bin/env python3
from xml.etree import ElementTree as ET
import re, json, sys

svg_path = 'public/assets/Karte-neutral.svg'

ns = {'svg': 'http://www.w3.org/2000/svg'}

def parse_numbers(s):
    nums = re.findall(r"[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?", s)
    return [float(n) for n in nums]


def points_from_path(d):
    tokens = re.findall(r'[A-Za-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?', d)
    pts = []
    i = 0
    cmd = None
    cur_x = 0.0
    cur_y = 0.0
    start_x = None
    start_y = None
    while i < len(tokens):
        t = tokens[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t
            i += 1
            continue
        nums = []
        while i < len(tokens) and not re.match(r'[A-Za-z]', tokens[i]):
            nums.append(float(tokens[i]))
            i += 1
        j = 0
        if cmd is None:
            cmd = 'l'
        while j+1 < len(nums):
            x = nums[j]
            y = nums[j+1]
            if cmd.islower():
                cur_x = cur_x + x
                cur_y = cur_y + y
            else:
                cur_x = x
                cur_y = y
            pts.append((cur_x, cur_y))
            if start_x is None:
                start_x = cur_x
                start_y = cur_y
            j += 2
    return pts


def main():
    try:
        tree = ET.parse(svg_path)
    except Exception as e:
        print('ERROR parsing SVG:', e, file=sys.stderr)
        sys.exit(1)
    root = tree.getroot()
    positions = {}
    for elem in root.iter():
        id_attr = elem.get('id')
        if not id_attr:
            continue
        tag = elem.tag
        if tag.endswith('path'):
            d = elem.get('d')
            if not d:
                continue
            pts = points_from_path(d)
            if not pts:
                continue
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            cx = sum(xs)/len(xs)
            cy = sum(ys)/len(ys)
            positions[id_attr] = {'x': round(cx, 1), 'y': round(cy, 1)}
        elif tag.endswith('polygon') or tag.endswith('polyline'):
            pts_attr = elem.get('points')
            if not pts_attr:
                continue
            nums = parse_numbers(pts_attr)
            pts = [(nums[i], nums[i+1]) for i in range(0, len(nums), 2)]
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            cx = sum(xs)/len(xs)
            cy = sum(ys)/len(ys)
            positions[id_attr] = {'x': round(cx,1), 'y': round(cy,1)}
        elif tag.endswith('rect'):
            x = float(elem.get('x', '0'))
            y = float(elem.get('y', '0'))
            w = float(elem.get('width', '0'))
            h = float(elem.get('height', '0'))
            positions[id_attr] = {'x': round(x + w/2,1), 'y': round(y + h/2,1)}
    print(json.dumps(positions, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
