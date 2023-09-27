import React from 'react'
import http from '../helpers/http'
import { Helmet } from 'react-helmet'
import { Formik } from 'formik'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

function Home() {
    const [cluster, setCluster] = React.useState([])
    const [detailCluster, setDetailCluster] = React.useState([])
    const [status_huni, setStatus_huni] = React.useState([])
    const [status_payment, setStatus_payment] = React.useState([])
    const [searchParams, setSearchParams] = useSearchParams('')
    const [modalDetail, setModalDetail] = React.useState(false)
    const [selectedParamId, setSelectedParamId] = React.useState(null)
    const [openModalDelete, setOpenModalDelete] = React.useState(false)
    // const [tabCluster, setTabCluster] = React.useState(1)
    // const [totalPage, setTotalPage] = React.useState()
    const navigate = useNavigate()

    const { id } = useParams()

    const getDataCluster = React.useCallback(async () => {
        const { data } = await http().get(`/cluster?limit=10&${searchParams}`)
        // setTotalPage(data.totalPage)
        setCluster(data.results)
        // console.log(data)
    }, [searchParams])

    React.useEffect(() => {
        getDataCluster()
    }, [getDataCluster])

    const getDetailCluster_data = React.useCallback(async () => {
        const { data } = await http().get(`/cluster/${id}`)
        // console.log(data.results)
        setDetailCluster(data.results)
    }, [id])

    React.useEffect(() => {
        getDetailCluster_data()
    }, [getDetailCluster_data])

    React.useEffect(() => {
        async function getData_status_huni() {
            const { data } = await http().get('/status_huni')
            setStatus_huni(data.results)
        }
        getData_status_huni()
    }, [])

    React.useEffect(() => {
        async function getData_status_payment() {
            const { data } = await http().get('/status_payment')
            setStatus_payment(data.results)
        }
        getData_status_payment()
    }, [])

    const onSearch = (values) => {
        setSearchParams(`search=${values.search}`);
    };

    const create_customers = async values => {
        try {
            const form = new URLSearchParams(values);
            const { data } = await http().post('/cluster', form.toString());
            console.log(data)
            if (data) {
                getDataCluster();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const openModal = async (paramId) => {
        // console.log("Open Modal with ID:", paramId);
        if (modalDetail === true) {
            setModalDetail(false)
            setSelectedParamId(null)
            setDetailCluster({})
        } else {
            setModalDetail(true)
            const { data } = await http().get(`/cluster/${paramId}`)
            setDetailCluster(data.results)
        }
    }

    const update_customers = async (id, values) => {
        try {
            const form = new URLSearchParams(values)
            const { data } = await http().patch(`/cluster/${id}`, form.toString())
            if (data) {
                setModalDetail(false)
                getDataCluster()
            }
        } catch (error) {
            console.log('error:', error)
        }
    }

    const handleDeleteModalOpen = () => {
        setOpenModalDelete(true)
    }
    const handleDeleteModalClose = () => {
        setOpenModalDelete(false)
    }

    const handleDelete = async (id) => {
        const { data } = await http().delete(`/cluster/${id}`)
        getDataCluster()
        setOpenModalDelete(false)
        if (data) {
            navigate('/')
        }
    }

    // const handlePrevPage = () => {
    //     if (tabCluster > 1) {
    //         setTabCluster(tabCluster - 1);
    //     }
    // }

    // const handleNextPage = () => {
    //     if ((tabCluster + 1) <= totalPage) {
    //         setTabCluster(tabCluster + 1);
    //     }

    // };

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
                <meta name="Dashboard" content="Dashboard data custumers" />
            </Helmet>
            <div className='font-bold text-red-500 text-2xl flex justify-center items-center mt-10'>Dashboard</div>
            <div className='flex justify-end items-center gap-5 mr-16'>
                <Formik
                    initialValues={{
                        search: ""
                    }}
                    onSubmit={onSearch}
                >
                    {({ handleBlur, handleChange, handleSubmit, values }) => (
                        <>
                            <form onSubmit={handleSubmit} className='flex gap-3'>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    name='search'
                                    className="input input-bordered w-[300px] max-w-xs"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.search} />
                                <div>
                                    <button type='submit' className="btn btn-accent normal-case">Search</button>
                                </div>
                            </form>
                        </>
                    )}
                </Formik>
            </div>
            <div className='ml-10'>
                {/* The button to open modal */}
                <label htmlFor="my_modal_7" className="btn btn-primary text-white font-bold">Add Customers</label>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add New Customers</h3>
                        <p className="py-4">Please input to be save!</p>
                        <Formik
                            initialValues={{
                                name: '',
                                cluster_nomer: '',
                                status_payment_id: '',
                                status_huni_id: ''
                            }}
                            onSubmit={create_customers}>
                            {({ handleBlur, handleChange, handleSubmit, values }) => (
                                <>
                                    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                name='name'
                                                className="input input-bordered input-primary w-full max-w-xs"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nomor Rumah"
                                                name='cluster_nomer'
                                                className="input input-bordered input-primary w-full max-w-xs"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.cluster_nomer}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                className='select select-primary text-black w-[320px]'
                                                name='status_huni_id'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.status_huni_id || 'silahkan Pilih'}>
                                                <option value="">Silahkan Pilih</option>
                                                {status_huni.map(item => (
                                                    <>
                                                        <option key={item?.id} value={item?.id}>
                                                            {item?.name}
                                                        </option>
                                                    </>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                className='select select-primary text-black w-[320px]'
                                                name='status_payment_id'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.status_payment_id || 'Silahkan Pilih'}>
                                                <option value="">Silahkan Pilih</option>
                                                {status_payment.map(item => (
                                                    <>
                                                        <option key={item?.id} value={item?.id}>
                                                            {item?.name}
                                                        </option>
                                                    </>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <button type='submit' className="btn btn-accent normal-case w-[320px]">Save</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </Formik>
                        <div className="modal-action">
                            <label htmlFor="my_modal_7" className="btn">Close!</label >
                        </div>
                    </div>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 mt-10">
                <thead>
                    <tr>
                        <th className="px-6 py-3  bg-gray-50 text-left text-xs leading-4 font-bold text-black uppercase tracking-wider">
                            Nama Pemilik
                        </th>
                        <th className="px-6 py-3  bg-gray-50 text-left text-xs leading-4 font-bold text-black uppercase tracking-wider">
                            Nomor Rumah
                        </th>
                        <th className="px-6 py-3  bg-gray-50 text-left text-xs leading-4 font-bold text-black uppercase tracking-wider">
                            Status Huni
                        </th>
                        <th className="px-6 py-3  bg-gray-50 text-left text-xs leading-4 font-bold text-black uppercase tracking-wider">
                            Status Pembayaran Iuran
                        </th>
                        <th className="px-6 py-3  bg-gray-50 text-left text-xs leading-4 font-bold text-black uppercase tracking-wider">
                            Detail
                        </th>
                    </tr>
                </thead>
                {cluster.map(item => {
                    return (
                        <>
                            <tbody>
                                <tr>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        {item?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        {item?.cluster_nomer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        {item?.status_huni}
                                    </td>
                                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        {item?.payment_status}
                                    </td>
                                    <td className='flex gap-4 px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                        <div>
                                            <button htmlFor="my_modal_8" onClick={() => openModal(item.id)} className="btn btn-secondary normal-case">Edit</button>

                                            {/* Put this part before </body> tag */}
                                            <input type="checkbox" id="my_modal_8" className="modal-toggle" checked={modalDetail} />
                                            <div className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Update!</h3>
                                                    <p className="py-4">Upudate This Customers</p>
                                                    <Formik
                                                        initialValues={{
                                                            name: detailCluster?.name,
                                                            cluster_nomer: detailCluster?.cluster_nomer,
                                                            status_payment_id: detailCluster?.status_payment_id,
                                                            status_huni_id: detailCluster?.status_huni_id
                                                        }}
                                                        enableReinitialize={true}
                                                        onSubmit={(values) => update_customers(item.id, values)}>
                                                        {({ handleBlur, handleChange, handleSubmit, values }) => (
                                                            <>
                                                                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                                                                    <div className='flex flex-col gap-2'>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Name"
                                                                            name='name'
                                                                            className="input input-bordered input-primary w-full max-w-xs"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values.name}
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Nomor Rumah"
                                                                            name='cluster_nomer'
                                                                            className="input input-bordered input-primary w-full max-w-xs"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values.cluster_nomer}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <select
                                                                            className='select select-primary text-black w-[320px]'
                                                                            name='status_huni_id'
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values?.status_huni_id}>
                                                                            {status_huni.map(item => (
                                                                                <>
                                                                                    <option key={item?.id} value={item?.id}>
                                                                                        {item?.name}
                                                                                    </option>
                                                                                </>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <select
                                                                            className='select select-primary text-black w-[320px]'
                                                                            name='status_payment_id'
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            value={values.status_payment_id}>
                                                                            {status_payment.map(item => (
                                                                                <>
                                                                                    <option key={item?.id} value={item?.id}>
                                                                                        {item?.name}
                                                                                    </option>
                                                                                </>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <button type='submit' className="btn btn-accent normal-case w-[320px]">Save</button>
                                                                    </div>
                                                                </form>
                                                            </>
                                                        )}
                                                    </Formik>
                                                    <div className="modal-action">
                                                        <button onClick={openModal} htmlFor="my_modal_8" className="btn">Close!</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button onClick={handleDeleteModalOpen} htmlFor="my_modal_6" className="btn btn-error normal-case text-white">Delete</button >
                                            <input type="checkbox" id="my_modal_6" className="modal-toggle" checked={openModalDelete} />
                                            <div className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg">Delete</h3>
                                                    <p className="py-4">Are you sure for delete data?</p>
                                                    <div className="modal-action">
                                                        <button onClick={() => handleDelete(item.id)} className="btn btn-error text-white">Delete</button>
                                                        <button onClick={handleDeleteModalClose} htmlFor="my_modal_6" className="btn">Cancle</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </>
                    )
                })}
            </table>
            {/* <div className="flex justify-center items-center gap-5 mt-10 mb-10">
                <div className="flex justify-center items-center">
                    <div>
                        <button className="btn btn-base-100 shadow-lg shadow-black-500/70" onClick={handlePrevPage}><AiOutlineArrowLeft size={20} color="black" /></button>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div>
                        <button className="btn btn-primary shadow-lg shadow-black-500/70" onClick={handleNextPage}><AiOutlineArrowRight size={20} color="white" /></button>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Home