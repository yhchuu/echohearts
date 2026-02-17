import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mecuqnovipudbtztshxc.supabase.co'
const supabaseKey = 'sb_publishable_Q_LJd9vSHh2On6Rtc3YXpg_l1FJr885'

export const supabase = createClient(supabaseUrl, supabaseKey)
