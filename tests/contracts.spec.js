import {test,expect} from '@playwright/test';
test('five-slide generation contract and phrase-only replacement',async({page})=>{
 await page.goto('http://127.0.0.1:18765');
 await page.route('**/api/generate',r=>r.fulfill({json:{slides:Array.from({length:5},(_,i)=>({layout:'hero',headline:`Generated contract ${i}`,body:'Body',kicker:'TEST MOCK'}))}}));
 await page.getByLabel('Deck topic').fill('Contract fixture');await page.getByRole('button',{name:'Generate 5',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Slides'}).getByRole('button')).toHaveCount(5);
 const head=page.getByRole('textbox',{name:'headline',exact:true});await head.fill('Keep this phrase intact');await head.blur();
 await head.evaluate(el=>{const range=document.createRange();range.setStart(el.firstChild,5);range.setEnd(el.firstChild,9);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));});
 await expect(page.getByLabel('Selected text')).toHaveText('this');
 await page.route('**/api/improve',r=>r.fulfill({json:{text:'that'}}));await page.getByRole('button',{name:'Improve selection',exact:true}).click();await page.getByRole('button',{name:'Accept',exact:true}).click();await expect(head).toHaveText('Keep that phrase intact');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 // Existing saved revisions deliberately conflict until reopened.
 const status=await page.getByRole('status').textContent();
 if(status.includes('Another editor')){await page.getByRole('button',{name:'Reopen',exact:true}).click();await expect(page.getByRole('status')).toHaveText('Reopened saved deck');}
 await page.setViewportSize({width:600,height:900});await page.screenshot({path:'evidence/narrow-editor.png',fullPage:true});
});
