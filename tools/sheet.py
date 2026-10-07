# Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission.
import sys,glob,os
from PIL import Image, ImageDraw
pat=sys.argv[1]; out=sys.argv[2]; W=int(sys.argv[3]) if len(sys.argv)>3 else 620
fs=sorted(glob.glob(pat))
ims=[]
for f in fs:
  im=Image.open(f).convert('RGB'); s=W/max(im.size); im=im.resize((int(im.width*s),int(im.height*s)),Image.LANCZOS); ims.append((os.path.basename(f),im))
cols=int(sys.argv[4]) if len(sys.argv)>4 else 3
rows=(len(ims)+cols-1)//cols
cw=W+10; rh=max(i.height for _,i in ims)+24
sheet=Image.new('RGB',(cw*cols,rh*rows),'white');d=ImageDraw.Draw(sheet)
for k,(n,i) in enumerate(ims):
  x=(k%cols)*cw;y=(k//cols)*rh;sheet.paste(i,(x,y+18));d.text((x+2,y+3),n,fill='red')
sheet.save(out,quality=85)
print(out,sheet.size)
