'use client'

import React, { useState, useRef, useEffect } from 'react'
import Sha256 from 'crypto-js/sha256'
import { useAuth } from '@/Context/AuthContext'

type Line = {
  input: string
  output: string[]
}

type FirewallRule = string

export default function Console() {
  const { user } = useAuth()
  const [lines, setLines] = useState<Line[]>([
    {
      input: '',
      output: ['Welcome to Cybox Console!', 'Type "help" for help.'],
    },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      setCwd(`${user.name}@Cybox:~$`)
    }
  }, [user])

  const runCommand = (cmd: string): string[] => {
    const [base, ...args] = cmd.trim().split(' ')
    const argStr = args.join(' ')

    switch (base.toLowerCase()) {
      case 'echo':
        return [argStr]

      case 'cls':
        setLines([])
        return []

      case 'help':
        return [
          'Available commands:',
          'help                        Show this message',
          'cls                         Clear the screen',
          'echo <text>                 Print output',
          'whoami                      Show current user',
          'passwd                      Simulate password change',
          'hash <text>                 Generate SHA256 hash',
          'nmap <host>                 Simulate port scanning',
          'firewall list/add/remove    Manage firewall rules',
          'ipconfig                    Show IP configuration',
          'ping <host>                 Simulate pinging a host',
          'traceroute <host>          Simulate network path',
          'netstat                    Show open network ports',
          'nslookup <domain>          Simulate DNS query',
          'whois <domain>             Simulate WHOIS lookup',
        ]

      case 'whoami':
        return [`User: ${user?.name}`]

      case 'passwd':
        return ['Password updated successfully. (Simulated)']

      case 'hash':
        if (!argStr) return ['Usage: hash <text>']
        return [`SHA256: ${Sha256(argStr).toString()}`]

      case 'nmap':
        if (!argStr) return ['Usage: nmap <host>']
        return [
          `Starting simulated Nmap scan on ${argStr}...`,
          'PORT     STATE SERVICE',
          '22/tcp   open  ssh',
          '80/tcp   open  http',
          '443/tcp  open  https',
          'Scan complete.',
        ]

      case 'firewall':
        const sub = args[0]
        const rule = args.slice(1).join(' ')
        if (sub === 'list') return firewallRules.length ? firewallRules.map((r, i) => `${i + 1}. ${r}`) : ['No firewall rules.']
        if (sub === 'add') {
          if (!rule) return ['Usage: firewall add <rule>']
          setFirewallRules(prev => [...prev, rule])
          return [`Rule added: "${rule}"`]
        }
        if (sub === 'remove') {
          if (!rule) return ['Usage: firewall remove <rule>']
          setFirewallRules(prev => prev.filter(r => r !== rule))
          return [`Rule removed: "${rule}"`]
        }
        return ['Usage: firewall list|add|remove <rule>']

      case 'ipconfig':
      case 'ifconfig':
        return [
          'Ethernet adapter Local Area Connection:',
          '  IPv4 Address. . . . . . . . . . . : 192.168.1.101',
          '  Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '  Default Gateway . . . . . . . . . : 192.168.1.1',
        ]

      case 'ping':
        if (!argStr) return ['Usage: ping <host>']
        return [
          `Pinging ${argStr} with 32 bytes of data:`,
          'Reply from 192.168.1.1: bytes=32 time=12ms TTL=64',
          'Reply from 192.168.1.1: bytes=32 time=14ms TTL=64',
          'Reply from 192.168.1.1: bytes=32 time=10ms TTL=64',
          'Ping statistics for 192.168.1.1:',
          '    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),',
        ]

      case 'traceroute':
        if (!argStr) return ['Usage: traceroute <host>']
        return [
          `Tracing route to ${argStr}...`,
          ' 1   1 ms   1 ms   1 ms  router.local [192.168.1.1]',
          ' 2   9 ms   8 ms   7 ms  isp-gateway.net [10.0.0.1]',
          ' 3  20 ms  22 ms  18 ms  104.244.42.1',
          ' 4  34 ms  35 ms  33 ms  edge-node.london [198.51.100.10]',
          'Trace complete.',
        ]

      case 'netstat':
        return [
          'Active Connections:',
          'Proto  Local Address          Foreign Address        State',
          'TCP    192.168.1.101:49722    104.244.42.1:443       ESTABLISHED',
          'TCP    192.168.1.101:49723    142.250.190.14:443     TIME_WAIT',
        ]

      case 'nslookup':
        if (!argStr) return ['Usage: nslookup <domain>']
        return [
          `Server:  dns.google`,
          `Address: 8.8.8.8`,
          ``,
          `Non-authoritative answer:`,
          `${argStr}  has address 142.250.190.14`,
        ]

      case 'whois':
        if (!argStr) return ['Usage: whois <domain>']
        return [
          `Domain Name: ${argStr.toUpperCase()}`,
          'Registrar: Simulated Registry Ltd.',
          'Creation Date: 2022-01-01',
          'Expiration Date: 2025-01-01',
          'Name Server: NS1.SIMULATED.NET',
        ]

      default:
        return [`'${base}' is not recognized as a valid command.`]
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const output = runCommand(input)
    setLines((prev) => [...prev, { input, output }])
    setHistory((prev) => [input, ...prev])
    setInput('')
    setHistoryIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const index = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1)
      setInput(history[index] ?? input)
      setHistoryIndex(index)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const index = historyIndex === null ? null : historyIndex - 1
      setInput(index === null ? '' : history[index] ?? '')
      setHistoryIndex(index)
    }
  }

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
  }, [lines])

  return (
    <div className="h-full w-full text-primary font-mono text-md overflow-hidden shadow-inner flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-1"
      >
        {lines.map((line, index) => (
          <div key={index}>
            {line.input && (
              <div className='mt-2'>
                <span className="text-primary font-bold">PS {cwd}&gt; </span>
                <span className="text-primary">{line.input}</span>
              </div>
            )}
            {line.output.map((out, i) => (
              <div key={i} className="text-primary">{out}</div>
            ))}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-primary mr-1 font-bold">PS {cwd}&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent flex-1 text-white outline-none"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}