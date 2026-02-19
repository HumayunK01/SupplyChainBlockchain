'use client'

import { motion } from 'framer-motion'
import { MapPin, AlertCircle } from 'lucide-react'
import { Role, RoleType } from './types'
import { ROLE_CONFIG } from './constants'

interface RoleGroupCardProps {
    roleType: RoleType
    roleList: Role[]
    index: number
}

export const RoleGroupCard = ({ roleType, roleList, index }: RoleGroupCardProps) => {
    const config = ROLE_CONFIG[roleType]
    const Icon = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${config.lightColor} ${config.textColor} flex items-center justify-center`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{config.plural}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{roleList.length} Connected Entities</p>
                    </div>
                </div>
            </div>

            {roleList.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <AlertCircle size={32} className="text-slate-200" />
                    </div>
                    <h4 className="text-slate-900 font-bold">No Records Found</h4>
                    <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">No {config.plural.toLowerCase()} have been registered on the blockchain yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-12 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-20 whitespace-nowrap">ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Entity Details</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Operations</th>
                                <th className="pl-6 pr-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Protocol Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {roleList.map((role) => (
                                <tr key={role.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="pl-12 pr-4 py-8 whitespace-nowrap">
                                        <div className={`w-10 h-10 rounded-xl ${config.lightColor} ${config.textColor} flex items-center justify-center font-bold text-xs border border-transparent group-hover:border-white group-hover:shadow-sm transition-all shadow-sm shadow-slate-900/5`}>
                                            {role.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div>
                                            <div className="font-bold text-slate-900 text-base leading-tight">{role.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verified Node</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                                                <MapPin size={14} />
                                            </div>
                                            {role.place}
                                        </div>
                                    </td>
                                    <td className="pl-6 pr-12 py-8 text-right whitespace-nowrap">
                                        <div className="inline-flex bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold text-slate-500 group-hover:bg-white group-hover:text-slate-900 group-hover:border-slate-200 transition-all shadow-sm max-w-[120px] truncate">
                                            {role.addr}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    )
}

interface RoleGroupListProps {
    roles: {
        rms: Role[]
        man: Role[]
        dis: Role[]
        ret: Role[]
    }
}

export const RoleGroupList = ({ roles }: RoleGroupListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(['rms', 'man', 'dis', 'ret'] as const).map((roleType, index) => (
                <RoleGroupCard
                    key={roleType}
                    roleType={roleType}
                    roleList={roles[roleType]}
                    index={index}
                />
            ))}
        </div>
    )
}
