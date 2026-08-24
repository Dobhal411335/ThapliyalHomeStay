"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, CheckSquare, Square, Mail, Users, Check } from "lucide-react"
import "react-quill-new/dist/quill.snow.css"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

// 🔥 Full Toolbar Configuration
const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "video"],
    ["clean"],
]

const modules = {
    toolbar: toolbarOptions,
}

export default function SendPromoEmailPage({ allUsers = [] }) {
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [selectedEmails, setSelectedEmails] = useState([])
    const [loading, setLoading] = useState(false)
    const [newsletterEmails, setNewsletterEmails] = useState([])
    
    useEffect(() => {
        fetch('/api/newsLetter')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setNewsletterEmails(data.emails || []);
            }
          });
    }, []);
      
    const allEmails = [...new Set([...allUsers.map(u => u.email), ...newsletterEmails])].filter(Boolean); // deduplicate and remove empty
      
    const handleToggleEmail = (email) => {
        setSelectedEmails((prev) =>
            prev.includes(email)
                ? prev.filter((e) => e !== email)
                : [...prev, email]
        )
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedEmails(allEmails)
        } else {
            setSelectedEmails([])
        }
    }

    const handleSendEmail = async () => {
        setLoading(true)
        if (!subject || !message || selectedEmails.length === 0) {
            toast.error("Please fill all fields and select at least one recipient.", {
                style: {
                    borderRadius: "10px",
                    border: "1px solid #fee2e2",
                    background: "#fef2f2",
                    color: "#991b1b"
                },
            })
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/admin/send-promo-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message, recipients: selectedEmails }),
            })
            const data = await response.json()

            if (data.success) {
                toast.success("Email sent successfully!", {
                    style: {
                        borderRadius: "10px",
                        border: "1px solid #dcfce7",
                        background: "#f0fdf4",
                        color: "#166534"
                    },
                })
                window.location.reload()
            } else {
                toast.error("Failed to send email.", {
                    style: {
                        borderRadius: "10px",
                        border: "1px solid #fee2e2",
                        background: "#fef2f2",
                        color: "#991b1b"
                    },
                })
            }
        } catch (error) {
            console.error("Error sending email:", error.message)
            toast.error("Network error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const formatNumeric = (num) => new Intl.NumberFormat('en-IN').format(num);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24 mt-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Promotional Emails</h1>
                    <p className="text-sm text-slate-500 mt-1">Compose and send promotional emails to your registered users and newsletter subscribers.</p>
                </div>
            </div>

            <div className="gap-2 flex items-start flex-row-reverse">
                {/* Email Form (Top) */}
                <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <CardTitle className="text-lg font-semibold text-slate-800">Compose Email</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 mt-1">Write the subject and content of your promotional message.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="subject" className="text-slate-700 font-medium">Email Subject</Label>
                            <Input
                                id="subject"
                                placeholder="E.g., Special Weekend Offer!"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-700 font-medium">Email Content</Label>
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50/50 [&_.ql-container]:border-0 [&_.ql-container]:min-h-75">
                                <ReactQuill
                                    theme="snow"
                                    value={message}
                                    onChange={setMessage}
                                    modules={modules}
                                    className="h-75"
                                    placeholder="Write your email content here..."
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-6 flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                            {selectedEmails.length > 0 ? (
                                <span><strong className="text-slate-800">{formatNumeric(selectedEmails.length)}</strong> recipients selected</span>
                            ) : (
                                <span>No recipients selected</span>
                            )}
                        </div>
                        <Button 
                            disabled={loading || selectedEmails.length === 0 || !subject || !message} 
                            onClick={handleSendEmail}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send Email
                        </Button>
                    </CardFooter>
                </Card>

                {/* Recipient Selection (Bottom) */}
                <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-white/50 pb-6 flex flex-row items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">Select Recipients</CardTitle>
                                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">
                                    {formatNumeric(allEmails.length)} Total
                                </Badge>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">Choose which users will receive this email.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="max-h-[500px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="w-12 pl-6">
                                            <Checkbox 
                                                checked={selectedEmails.length === allEmails.length && allEmails.length > 0}
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all"
                                                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            />
                                        </TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Email Address</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12 text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allEmails.length > 0 ? (
                                        allEmails.map((email) => {
                                            const isSelected = selectedEmails.includes(email);
                                            return (
                                                <TableRow 
                                                    key={email} 
                                                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                                    onClick={() => handleToggleEmail(email)}
                                                >
                                                    <TableCell className="pl-6 py-4">
                                                        <Checkbox 
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleToggleEmail(email)}
                                                            aria-label={`Select ${email}`}
                                                            className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{email}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        {isSelected ? (
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                <Check className="w-3 h-3 mr-1" /> Selected
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-sm text-slate-400 group-hover:text-slate-500">Unselected</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-500">
                                                    <Users className="w-8 h-8 mb-2 text-slate-300" />
                                                    <p>No email addresses found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
