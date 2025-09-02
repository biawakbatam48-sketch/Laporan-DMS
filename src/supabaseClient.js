import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mujwmrliifglftbfasau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11andtcmxpaWZnbGZ0YmZhc2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjcxMDUsImV4cCI6MjA3MjQwMzEwNX0.odbLe98iGmcJqoo7Xa-3UaTOIq-TO-VpvhnpkMS54Eo'
const supabase = createClient(supabaseUrl, supabaseKey)