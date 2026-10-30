/* Shared item-card labels. Keep raw stats and detail data unchanged. */
function itemCardLabels(i) {
  const text = value => typeof value === 'string' ? value.trim() : '';
  const missing = value => !value || /^(?:未知|未確認|待確認|未提供|未提供可解析限制|尚未取得|未標示|不明|—|-)$/.test(value);
  const unrestricted = value => /^(?:所有職業|全部職業|全職業|不限|無限制|不限制|不限職業|無職業限制|所有職業可用|全職業可用)$/.test(value.replace(/\s+/g, ''));
  const labels = [];
  const element = text(i.element);
  if (!missing(element)) labels.push({kind:'element', text: /屬性$/.test(element) ? element : element + '屬性'});
  const rawJob = text(i.job);
  const source = rawJob || (Array.isArray(i.jobTags) ? i.jobTags.filter(v=>typeof v==='string').join('／') : '');
  if (!missing(source) && !unrestricted(source)) {
    const jobs = [...new Set(source.replace(/^(?:職業限制|限定職業|適用職業)\s*[:：]\s*/, '')
      .split(/\s*[\/／、,，;；|]\s*/)
      .map(j=>j.trim().replace(/\s*系列$/, '系').replace(/(?:專屬|限定|可用)$/, '').trim())
      .filter(j=>!missing(j)))];
    if (jobs.length && !jobs.some(unrestricted)) labels.push({kind:'job', text: jobs.join('／') + (jobs.length===1 && !jobs[0].endsWith('系') ? '專屬' : '限定')});
  }
  return labels;
}
function itemStatPills(i) {
  const labels = itemCardLabels(i);
  return labels.length ? `<div class="item-stat-pills">${labels.map(label=>`<span data-item-label="${label.kind}">${esc(label.text)}</span>`).join('')}</div>` : '';
}
