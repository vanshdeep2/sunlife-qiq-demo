import md5 from 'blueimp-md5'

const shardCache = new Map()

/** Bucket contact_id into shard 0-19 (matches dataset generator: BigInt(md5) % 20). */
export function shardOf(contactId) {
  const hash = md5(String(contactId))
  return Number(BigInt(`0x${hash}`) % 20n)
}

export function shardUrl(contactId) {
  const n = String(shardOf(contactId)).padStart(2, '0')
  return `/data/shards/shard_${n}.json`
}

export async function loadShard(contactId) {
  const n = shardOf(contactId)
  if (shardCache.has(n)) return shardCache.get(n)

  const res = await fetch(shardUrl(contactId))
  if (!res.ok) throw new Error(`Failed to load shard ${n}`)
  const data = await res.json()
  shardCache.set(n, data)
  return data
}

export async function loadContactDetail(lightRecord) {
  if (!lightRecord?.contact_id) return lightRecord
  const shard = await loadShard(lightRecord.contact_id)
  const heavy = shard[lightRecord.contact_id] || {}
  return { ...lightRecord, ...heavy }
}

export function clearShardCache() {
  shardCache.clear()
}
