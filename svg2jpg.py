# import cario
from cairosvg import svg2png
from svgpathtools import svg2paths
# paths, attributes = svg2paths('./pictures/Carlos_Alvarez')
# print(paths)
# print(attributes)
svg_code = open('./pictures/Carlos_Alvarez','r')
svg_code = svg_code.read()
#
svg2png(bytestring=svg_code,write_to='output.png')

