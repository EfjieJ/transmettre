import json,asyncio,os,subprocess,edge_tts
L=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'lines.json')))
V={'avant':('fr-CA-JeanNeural','+8%','+0Hz'),'jeu':('fr-CA-AntoineNeural','+10%','+3Hz'),'apres':('fr-CA-SylvieNeural','+0%','+0Hz'),'gaston':('fr-CA-ThierryNeural','-10%','-8Hz'),'narr':('fr-CA-SylvieNeural','-4%','-2Hz')}
os.makedirs('audio',exist_ok=True); sem=asyncio.Semaphore(6)
async def one(l):
  out=f"audio/{l['id']}.mp3"
  if os.path.exists(out): return
  v,r,pi=V[l['who']]; tmp=f"/tmp/tts_{l['id']}.mp3"
  async with sem:
    for k in range(3):
      try: await edge_tts.Communicate(l['text'],v,rate=r,pitch=pi).save(tmp); break
      except Exception as e: await asyncio.sleep(2)
  subprocess.run(['ffmpeg','-loglevel','error','-y','-i',tmp,'-ac','1','-ar','24000','-b:a','32k',out],check=True)
async def main(): await asyncio.gather(*[one(l) for l in L])
asyncio.run(main())
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','lavfi','-i','anullsrc=r=24000:cl=mono','-t','0.3','-b:a','32k','audio/silence.mp3'],check=True)
ids=[l['id'] for l in L if os.path.exists(f"audio/{l['id']}.mp3")]
open('audio/index.js','w').write('window.AUDIO_IDS = new Set('+json.dumps(ids)+');\n')
print(len(ids),'/',len(L))
